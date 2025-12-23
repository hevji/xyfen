import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * TermsModal Component
 * Non-fullscreen modal for Terms of Use
 */
const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Replace with your actual terms text
  const TERMS_TEXT = `Your full Terms of Use go here.
Line breaks will be preserved.`;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose} // close when clicking outside
    >
      <div
        className="glass-strong rounded-3xl p-8 md:p-10 max-w-2xl w-full text-center space-y-6 animate-scale-in relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h2 className="font-display text-3xl font-bold text-foreground">
          Terms of Use
        </h2>

        <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line text-left max-h-[60vh] overflow-y-auto">
          {TERMS_TEXT}
        </p>

        <Button
          variant="hero"
          size="lg"
          onClick={onClose}
          className="w-full"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

/**
 * Footer Component
 */
const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="relative border-t border-border/30 py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Built with ❤️ using React & Flask
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Terms of Use
          </Button>
        </div>
      </footer>

      {isModalOpen && <TermsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Footer;
