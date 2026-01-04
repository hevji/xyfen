import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => void;
    };
  }
}

const WarningModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const turnstileCallback = (token: string) => {
      setVerified(!!token);
    };

    const container = document.getElementById("turnstile-container");
    if (container && window.turnstile) {
      window.turnstile.render(container, {
        sitekey: "0x4AAAAAACKQbzrFcssFcdii",
        callback: turnstileCallback,
      });
    }
  }, []);

  const handleAccept = () => {
    if (!verified) return;
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-bold">Before You Continue</h2>
        <p className="text-gray-600">
          This website allows downloading content from YouTube. Make sure you respect copyright laws.
        </p>

        {/* Turnstile widget */}
        <div id="turnstile-container" className="my-4"></div>

        <div className="flex gap-4 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDecline}
          >
            Decline
          </Button>

          <Button
            variant="default"
            className={`flex-1 ${!verified ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleAccept}
            disabled={!verified}
          >
            Accept & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
