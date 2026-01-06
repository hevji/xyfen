import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "xyfen_warning_ack";

type WarningState = "open" | "closed";

const WarningModal = () => {
  const initialState: WarningState = useMemo(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1" ? "closed" : "open";
    } catch {
      return "open";
    }
  }, []);

  const [state, setState] = useState<WarningState>(initialState);

  useEffect(() => {
    if (state === "open") {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [state]);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setState("closed");
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  if (state === "closed") return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-background/70 backdrop-blur-md pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Before you continue"
    >
      <div className="relative w-full max-w-lg glass-strong rounded-3xl border border-border/50 shadow-elegant overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-60 animate-gradient bg-[var(--gradient-primary)]" />
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={handleDecline}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-background/40 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <header className="space-y-2 pr-10">
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Notice
            </p>
            <h2 className="text-2xl sm:text-3xl font-display tracking-tight text-foreground">
              Before you continue
            </h2>
          </header>

          <section className="mt-4 space-y-3">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              This site lets you download YouTube content. Please respect copyright laws and
              only download content you have the rights to use.
            </p>
            <a
              href="/terms-of-service"
              className="text-sm underline underline-offset-4 text-primary hover:opacity-90"
            >
              Read Terms of Service
            </a>
          </section>

          <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="outline" className="sm:flex-1" onClick={handleDecline}>
              Decline
            </Button>
            <Button variant="hero" className="sm:flex-1" onClick={handleAccept}>
              Accept & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
