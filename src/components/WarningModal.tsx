import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * WarningModal Component
 * Displays a fullscreen warning about copyright before allowing site access
 */
const WarningModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const handleEnterSite = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("warningAccepted", "true");
    }, 500);
  };

  useEffect(() => {
    const accepted = sessionStorage.getItem("warningAccepted");
    if (accepted === "true") {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center p-4 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center space-y-6 animate-scale-in">
        {/* Warning Icon */}
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        {/* Warning Title */}
        <h2 className="font-display text-2xl font-bold text-foreground">
          ⚠️ Warning ⚠️
        </h2>

        {/* Warning Text */}
        <p className="text-muted-foreground leading-relaxed">
          This site allows downloading content from YouTube. Make sure you
          respect copyright laws and YouTube's terms of service.
        </p>

        {/* Enter Site Button */}
        <Button
          variant="hero"
          size="xl"
          onClick={handleEnterSite}
          className="w-full"
        >
          Enter Site
        </Button>
      </div>
    </div>
  );
};

export default WarningModal;