import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const STORAGE_KEY = "xyfen_warning_ack";

type WarningState = "open" | "closed";

const TERMS_TEXT = `Terms of Service

Last Updated: January 2025

1. Acceptance of Terms

By accessing or using Xyfen ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.

2. Description of Service

Xyfen provides tools to download content from YouTube and YouTube Music for personal, non-commercial use only. The Service is provided "as is" without warranties of any kind.

3. User Responsibilities

You are solely responsible for:
- Ensuring you have the legal right to download any content
- Complying with all applicable copyright laws
- Using downloaded content only for personal, non-commercial purposes
- Not redistributing, selling, or publicly displaying downloaded content without authorization

4. Copyright and Intellectual Property

All content available through YouTube and YouTube Music is owned by respective copyright holders. Xyfen does not host, store, or claim ownership of any content. Users must respect intellectual property rights and only download content they are authorized to use.

5. Prohibited Uses

You may NOT use this Service to:
- Download content you do not have rights to use
- Circumvent digital rights management (DRM) protections
- Distribute, sell, or commercially exploit downloaded content
- Violate any applicable laws or regulations
- Infringe upon the rights of content creators or copyright holders

6. Disclaimer of Warranties

THE SERVICE IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF THE SERVICE.

7. Limitation of Liability

IN NO EVENT SHALL XYFEN BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.

8. Indemnification

You agree to indemnify and hold harmless Xyfen and its operators from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.

9. Changes to Terms

We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.

10. Governing Law

These Terms shall be governed by applicable laws. Any disputes shall be resolved in the appropriate jurisdiction.

11. Contact

For questions about these Terms, please contact us through the appropriate channels.

By using Xyfen, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`;

const WarningModal = () => {
  const initialState: WarningState = useMemo(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1" ? "closed" : "open";
    } catch {
      return "open";
    }
  }, []);

  const [state, setState] = useState<WarningState>(initialState);
  const [showTerms, setShowTerms] = useState(false);

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
    window.location.href = "https://www.google.com/?utm_source=xyfen";
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
            
            <button
              onClick={() => setShowTerms(!showTerms)}
              className="flex items-center gap-2 text-sm text-primary hover:opacity-90 transition-opacity"
            >
              {showTerms ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showTerms ? "Hide Terms of Service" : "Read Terms of Service"}
            </button>

            {showTerms && (
              <ScrollArea className="h-48 w-full rounded-lg border border-border/50 bg-background/30 p-4">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {TERMS_TEXT}
                </pre>
              </ScrollArea>
            )}
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
