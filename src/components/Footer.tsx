import { useState } from "react";
import { ExternalLink, Heart } from "lucide-react";

// Replace this with your actual terms text
const TERMS_TEXT = `Your full Terms of Use go here...
You can paste the entire text, line breaks will be preserved.`;

// Modal component
interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  termsText: string;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, termsText }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="bg-white w-full h-full p-8 overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        <button
          className="absolute top-4 right-4 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold mb-4">Terms of Use</h1>
        <div className="whitespace-pre-line">{termsText}</div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="relative border-t border-border/30 py-8 px-4 mt-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              Built with <Heart className="w-3.5 h-3.5 text-primary animate-bounce-subtle" /> using React & Flask
            </p>
            
            <div className="flex gap-2">
              {/* License Link */}
              <a
                href="https://github.com/hevji/xyfen/blob/main/LICENCE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group px-4 py-2 rounded-lg hover:bg-secondary/50"
              >
                <span className="font-medium">MIT License</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Terms of Use Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 px-4 py-2 rounded-lg hover:bg-secondary/50"
              >
                Terms of Use
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <TermsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        termsText={TERMS_TEXT}
      />
    </>
  );
};

export default Footer;
