import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import logoImg from "@/assets/logo.webp";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

const INITIAL_GREETING: ChatMessage = {
  role: "model",
  text: "Hi! I'm the Elite Painting Solutions assistant. Ask me about our services, scheduling, or request a free quote — I'm happy to help!",
};

const FALLBACK_REPLY =
  "Thanks for reaching out! Looks like the chatbot is having an issue at the moment. " +
  "You can reach us directly: call or text (772) 539-2115, email eps.paintingsolutions@gmail.com, " +
  "or fill out the contact form on this page and we'll get right back to you.";

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

const GEMINI_API_KEY =
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? "";

const callGemini = async (
  history: ChatMessage[],
  message: string,
): Promise<string | null> => {
  if (!GEMINI_API_KEY) return null;
  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" +
      encodeURIComponent(GEMINI_API_KEY);

    const contents = [
      ...history.slice(-10).map((t) => ({
        role: t.role,
        parts: [{ text: t.text }],
      })),
      { role: "user" as const, parts: [{ text: message }] },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          role: "system",
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        generationConfig: { temperature: 0.6, maxOutputTokens: 256 },
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) return null;

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text === "string" && text.trim().length > 0) {
      return text.trim();
    }
    return null;
  } catch {
    return null;
  }
};

export const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) {
      setShowTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    if (!showTeaser || open) return;
    const t = setTimeout(() => setShowTeaser(false), 6000);
    return () => clearTimeout(t);
  }, [showTeaser, open]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", text: trimmed };
    const priorHistory = messages;

    setMessages([...priorHistory, userMsg]);
    setInput("");
    setLoading(true);

    const reply = (await callGemini(priorHistory, trimmed)) ?? FALLBACK_REPLY;

    setMessages((prev) => [...prev, { role: "model", text: reply }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`fixed z-40 flex gap-2 sm:bottom-6 sm:right-6 sm:left-auto sm:flex-row sm:items-end sm:gap-3 ${
        open
          ? "inset-x-3 bottom-3 flex-col items-stretch sm:inset-auto"
          : "bottom-4 right-4 items-end"
      }`}
    >
      {!open && showTeaser && (
        <div className="relative hidden max-w-[260px] rounded-2xl rounded-br-sm bg-card p-4 shadow-elegant animate-scale-in sm:block">
          <button
            onClick={() => setShowTeaser(false)}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#111] text-white shadow-card hover:bg-primary"
            aria-label="Close chat teaser"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 shadow-card">
              <img
                src={logoImg}
                alt="Elite Painting Solutions"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-card-foreground">
              Shoot me any questions, and I'll get back to you as soon as I have a minute! (I promise)
            </p>
          </div>
        </div>
      )}

      {open && (
        <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-card shadow-elegant animate-scale-in sm:w-[380px]">
          <div className="flex items-center justify-between gap-3 bg-[#111] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
                <img
                  src={logoImg}
                  alt="Elite Painting Solutions"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold">Elite Painting Assistant</span>
                <span className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Online now
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex h-[360px] flex-col gap-3 overflow-y-auto bg-muted/40 px-4 py-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-card text-card-foreground shadow-card"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-card px-3.5 py-2.5 text-sm text-muted-foreground shadow-card">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Typing…</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={`h-14 w-14 items-center justify-center self-end rounded-full bg-[#111] text-white shadow-glow transition-smooth hover:scale-110 hover:bg-primary sm:flex ${
          open ? "hidden" : "flex"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};
