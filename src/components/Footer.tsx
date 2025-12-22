import { ExternalLink } from "lucide-react";

/**
 * Footer Component
 * Site footer with license link
 */
const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Built with React & Flask. Use responsibly and respect copyright laws.
          </p>
          
          {/* License Link */}
          <a
            href="https://github.com/hevji/xyfen?tab=MIT-1-ov-file"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group"
          >
            <span>MIT License</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;