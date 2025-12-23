import { useState } from "react";
import { ExternalLink, Heart } from "lucide-react";

// Replace this with your actual terms text
const TERMS_TEXT = `Your full Terms of Use go here...
Paste the entire text here; line breaks will be preserved.`;

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Footer */}
      <footer className="relative border-t border-border/30 py-8 px-4 mt-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              Built with{" "}
              <Heart className="w-3.5 h-3.5 text-primary animate-bounce-subtle" />{" "}
              using React & Flask
            </p>

            <div className="flex gap-2">
              <a
                href="https://github.com/hevji/xyfen/blob/main/LICENCE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group px-4 py-2 rounded-lg hover:bg-secondary/50"
              >
                <span className="font-medium">MIT License</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

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

      {/* Full-page Terms Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setIsModalOpen(false)} // clicking outside closes
        >
          <div
            className="bg-white w-full h-full p-8 overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <button
              className="absolute top-4 right-4 text-2xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
            <div className="whitespace-pre-line">{TERMS_TEXT}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
