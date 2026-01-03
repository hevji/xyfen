import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalyticsModalProps {
  onAccept: () => void;
}

const AnalyticsModal = ({ onAccept }: AnalyticsModalProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    localStorage.setItem("analytics_accepted", "true");
    onAccept();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm pointer-events-auto">
      <div className="bg-card border border-border/50 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-foreground mb-1">
              Analytics & Cookies
            </h3>
            <p className="text-xs text-muted-foreground">
              We use analytics to improve your experience. You can accept or dismiss this notice.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="text-xs h-8"
          >
            Dismiss
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="text-xs h-8 bg-primary hover:bg-primary/90"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
