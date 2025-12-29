import { useState, useEffect } from "react";
import { AlertTriangle, ArrowRight, Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isWarningAccepted, setWarningAccepted, areCookiesAccepted, setCookiesAccepted } from "@/lib/cookies";

/**
 * WarningModal Component
 * Displays a fullscreen warning about copyright and cookie consent
 */
const WarningModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const handleAccept = () => {
    setCookiesAccepted(true);
    setWarningAccepted();
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 600);
  };

  const handleDecline = () => {
    setCookiesAccepted(false);
    setWarningAccepted();
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 600);
  };

  useEffect(() => {
    if (isWarningAccepted()) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center p-4 transition-all duration-600 ${
        isFading ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="glass-strong rounded-3xl p-8 md:p-10 max-w-lg w-full text-center space-y-8 animate-scale-in relative">
        {/* Warning Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <AlertTriangle className="w-9 h-9 text-primary" />
          </div>
        </div>

        {/* Warning Title */}
        <h2 className="font-display text-3xl font-bold text-foreground">
          Before You Continue
        </h2>

        {/* Warning Text */}
        <div className="space-y-4 text-left">
          <p className="text-muted-foreground leading-relaxed">
            This site allows downloading content from YouTube. Make sure you
            respect copyright laws and YouTube's terms of service.
          </p>

          <div className="flex items-start gap-3 p-4 bg-card/50 rounded-xl border border-border/50">
            <Cookie className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-foreground text-sm">Cookie Consent</h3>
              <p className="text-muted-foreground text-sm mt-1">
                We use cookies to enhance your experience, remember your preferences, 
                and for authentication. By clicking "Accept & Continue", you consent to our use of cookies.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleDecline}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
            Decline Cookies
          </Button>
          <Button
            variant="hero"
            size="lg"
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition group"
          >
            Accept & Continue
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default WarningModal;
