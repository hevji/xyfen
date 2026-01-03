import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setWarningAccepted, setCookiesAccepted, isWarningAccepted } from "@/lib/cookies";

// Make sure you have Turnstile script loaded in your HTML:
// <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

const WarningModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (isWarningAccepted()) {
      setIsVisible(false);
      return;
    }

    // Initialize Turnstile
    const turnstileCallback = (token) => {
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
    if (!verified) return; // Prevent accept if not verified
    setCookiesAccepted(true);
    setWarningAccepted();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-bold">Before You Continue</h2>
        <p className="text-gray-600">
          This site allows downloading content from YouTube. Respect copyright laws and YouTube's terms of service.
        </p>

        <div id="turnstile-container" className="my-4"></div>

        <div className="flex gap-4 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setCookiesAccepted(false);
              setWarningAccepted();
              setIsVisible(false);
            }}
          >
            Decline
          </Button>

          <Button
            variant="primary"
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
