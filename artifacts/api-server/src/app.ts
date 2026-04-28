import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Trust the Replit / cloud proxy in front of us so rate-limit can see real IPs.
app.set("trust proxy", 1);

// --- Security headers ---------------------------------------------------
// Helmet sets a sane default set of HTTP security headers (HSTS, X-Frame-Options,
// X-Content-Type-Options, Referrer-Policy, etc.). Cross-origin policies are
// loosened slightly so the API can be embedded in a browser fetch from the
// painting site without breaking on third-party hosting.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }),
);

// --- CORS ---------------------------------------------------------------
// Lock the API to a known list of origins. Set ALLOWED_ORIGINS to a
// comma-separated list (e.g. "https://elitepaintingsolutions.com,https://cappahappa.github.io")
// in production. Anything not on the list is rejected.
const allowedOrigins = (process.env["ALLOWED_ORIGINS"] ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowReplitDev = (origin: string): boolean =>
  /\.replit\.(dev|app|co)$/i.test(new URL(origin).hostname) ||
  /\.repl\.co$/i.test(new URL(origin).hostname);

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin / curl / server-to-server (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true); // dev-friendly default
      try {
        if (allowedOrigins.includes(origin) || allowReplitDev(origin)) {
          return callback(null, true);
        }
      } catch {
        /* fall through */
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    maxAge: 600,
  }),
);

// --- Body parsing with hard size limits (defends against payload-size DoS) --
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

// --- Rate limiting ------------------------------------------------------
// 30 requests per minute per IP for any /api route. Tunable via env vars.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env["RATE_LIMIT_PER_MINUTE"] ?? 30),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again in a minute." },
});

// --- Request logging ----------------------------------------------------
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use("/api", apiLimiter, router);

export default app;
