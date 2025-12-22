import { ExternalLink, Heart } from "lucide-react";

/**
 * Footer Component
 * Site footer with license link
 */
const Footer = () => {
  return (
    <footer className="relative border-t border-border/30 py-8 px-4 mt-auto">
      {/* Subtle glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Built with <Heart className="w-3.5 h-3.5 text-primary animate-bounce-subtle" /> using React & Flask
          </p>
          
          {/* License Link */}
          <a
            href="https://github.com/hevji/xyfen?tab=MIT-1-ov-file"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 group px-4 py-2 rounded-lg hover:bg-secondary/50"
          >
            <span className="font-medium">MIT License</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;