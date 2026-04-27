import { Router, type IRouter, type Request, type Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { logger } from "../lib/logger";

const chatRouter: IRouter = Router();

const SYSTEM_INSTRUCTION = `You are the friendly assistant for Elite Painting Solutions, a 5-star, locally owned painting company serving Vero Beach, Sebastian, and all of Indian River County, Florida. The owner is Michael.

About the company:
- Phone: (772) 539-2115
- Email: eps.paintingsolutions@gmail.com
- 30+ years of experience, fully licensed and insured, family-owned
- Free in-home estimates with no pressure
- Workmanship warranty plus the manufacturer's paint warranty
- Premium paints (Sherwin-Williams, Benjamin Moore, low-VOC and zero-VOC options)

Services offered:
- Interior painting (walls, ceilings, trim, doors, accent walls)
- Exterior painting (siding, trim, fences, decks; pressure wash + 2 coats)
- Cabinet refinishing (factory-grade spray finish, typically 4-6 days)
- Commercial painting (offices, retail, multi-unit; nights/weekends available)
- Pressure washing (homes, decks, driveways, fences; soft-wash for delicate surfaces)
- Ceiling services (popcorn ceiling removal, repair, smooth refinishing)

Service areas (Indian River County, FL):
Vero Beach, Sebastian, Indian River Shores, Fellsmere, Wabasso, Roseland, Winter Beach, Gifford, Florida Ridge, Vero Lake Estates, Orchid.

Style guide:
- Be brief. 1-3 short sentences total. No paragraphs, no bullet lists, no headings, no markdown.
- Warm and conversational, but get to the point fast.
- Never invent prices. For pricing or scheduling, point them to (772) 539-2115 or the quote form.
- If they ask something outside painting, politely steer back in one sentence.
- Do not promise specific dates — Michael confirms scheduling personally.`;

type ChatTurn = { role: "user" | "model"; text: string };

const isChatTurn = (value: unknown): value is ChatTurn => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    (v.role === "user" || v.role === "model") &&
    typeof v.text === "string" &&
    v.text.length > 0
  );
};

chatRouter.post("/chat", async (req: Request, res: Response) => {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    logger.error("GEMINI_API_KEY is not set");
    return res.status(500).json({
      error: "Chat service is not configured.",
    });
  }

  const body = req.body as { message?: unknown; history?: unknown };
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: "message is too long" });
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history = rawHistory.filter(isChatTurn).slice(-10);

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contents = [
      ...history.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
      { role: "user" as const, parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 256,
        temperature: 0.6,
      },
    });

    const reply =
      response.text ??
      "Thanks for reaching out! For the fastest response, please call or text us at (772) 539-2115.";

    return res.json({ reply });
  } catch (err) {
    logger.error({ err }, "Gemini chat call failed");
    return res.status(502).json({
      error:
        "Sorry — I'm having trouble responding right now. Please call or text (772) 539-2115 and we'll get right back to you.",
    });
  }
});

export default chatRouter;
