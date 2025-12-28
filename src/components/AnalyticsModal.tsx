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
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999]">
      <div className="glass p-6 rounded-xl max-w-md mx-auto text-center">
        <h2 className="text-lg font-semibold mb-4">Analytics Notice</h2>
        <p className="mb-6 text-sm">
          This website uses Google Analytics to analyze traffic. By clicking "Okay," you consent to analytics tracking.
        </p>
        <Button onClick={handleAccept} className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
          Okay
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsModal;
