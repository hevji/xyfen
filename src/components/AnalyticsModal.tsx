import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const AnalyticsModal = ({ onAccept }: { onAccept: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("analytics_accepted");
    if (!accepted) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("analytics_accepted", "true");
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-80 bg-card/90 backdrop-blur-xl border border-border/50 rounded-xl p-4 shadow-lg flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">Analytics Notice</h3>
      <p className="text-xs text-muted-foreground">
        This website uses Google Analytics to analyze traffic. Click "Okay" to consent.
      </p>
      <Button
        onClick={handleAccept}
        className="self-end bg-gradient-to-r from-primary to-accent text-white text-sm"
      >
        Okay
      </Button>
    </div>
  );
};

export default AnalyticsModal;
