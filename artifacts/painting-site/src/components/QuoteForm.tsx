import { useState } from "react";
import { Link } from "react-router-dom";
import { PaintBucket, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImg from "@/assets/logo.webp";

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;
  if (len === 0) return "";
  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const QuoteForm = ({ heading = "GET A FREE QUOTE" }: { heading?: string }) => {
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setMessage("");
    setAgreed(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      toast({ title: "Please agree to the terms", variant: "destructive" });
      return;
    }
    if (phone.replace(/\D/g, "").length !== 10) {
      toast({
        title: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const subject = `New quote request — ${name.trim()} (${heading})`;
      const body =
        `Name: ${name.trim()}\n` +
        `Phone: ${phone.trim()}\n` +
        `Source: ${heading}\n\n` +
        `Project details:\n${message.trim()}\n`;
      const mailto =
        `mailto:info@elitepaintingsolutions.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      // Open the user's email client with their request pre-filled.
      window.location.href = mailto;

      setSuccess(true);
      resetForm();
      toast({
        title: "Got it! We received your request.",
        description: "We'll text or call you back as soon as we have a minute.",
      });
      setTimeout(() => setSuccess(false), 4500);
    } catch (err) {
      toast({
        title: "Couldn't send your request",
        description:
          err instanceof Error
            ? err.message
            : "Please try again or call (772) 539-2115.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="quote" className="rounded-xl bg-primary p-6 text-primary-foreground shadow-elegant sm:p-8">
      <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white p-1 shadow-yellow">
        <img src={logoImg} alt="Elite Painting Solutions logo" className="h-full w-full object-contain" />
      </div>
      <h2 className="heading-display mb-6 text-center text-3xl text-primary-foreground sm:text-4xl">
        {heading}
      </h2>

      {success && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 flex items-start gap-3 rounded-lg bg-white/95 p-4 text-foreground shadow-card animate-scale-in"
        >
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
          <div>
            <p className="font-display text-base font-black uppercase tracking-wide text-secondary">
              We got your request!
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Thanks for reaching out — we'll text or call you back as soon as we have a minute.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="qf-name" className="mb-1.5 block text-sm font-bold">Full Name *</label>
          <input
            id="qf-name"
            name="name"
            required
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            className="w-full rounded-md border-0 bg-background px-4 py-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="qf-phone" className="mb-1.5 block text-sm font-bold">Phone *</label>
          <input
            id="qf-phone"
            name="phone"
            required
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={14}
            placeholder="(555) 555-1234"
            value={phone}
            onChange={handlePhoneChange}
            disabled={submitting}
            className="w-full rounded-md border-0 bg-background px-4 py-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="qf-msg" className="mb-1.5 block text-sm font-bold">Tell us about your project *</label>
          <textarea
            id="qf-msg"
            name="message"
            required
            rows={4}
            placeholder="Your message goes straight to my phone — I'll get back to you as soon as I'm available."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={submitting}
            className="w-full resize-none rounded-md border-0 bg-background px-4 py-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={submitting}
            className="mt-1 h-4 w-4 cursor-pointer accent-yellow-400"
          />
          <span>
            I agree to{" "}
            <Link to="/terms" className="font-semibold underline">
              terms &amp; conditions
            </Link>{" "}
            provided by the company. By providing my phone number, I agree to receive text messages from the business.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-[#111] py-4 font-display text-lg font-black tracking-wide text-white shadow-card transition-smooth hover:scale-[1.01] hover:bg-black disabled:cursor-not-allowed disabled:opacity-90 disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending your request…</span>
            </>
          ) : (
            <>
              <PaintBucket className="h-5 w-5" />
              <span>Send My Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
