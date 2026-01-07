import { Download, Github, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Header Component
 * Site header with logo and navigation
 * Uses glassmorphism for a modern look
 */
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-500 group-hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-white/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Flame className="w-5 h-5 text-primary-foreground relative z-10" />
          </div>
          <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
            Xyfen
          </span>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          {/* Backend Download Button */}
          <Button
            variant="glass"
            size="sm"
            asChild
            className="gap-2"
          >
            <a
              href="https://github.com/hevji/Xyfen-Backend/releases/download/Backend-Zip/XYFEN_BACKEND.zip"
              download
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Backend Script (zip)</span>
            </a>
          </Button>

          {/* GitHub Link */}
          <a
            href="https://github.com/hevji/xyfen"
            target="_blank"
            rel="noopener noreferrer"
            className="relative p-2.5 rounded-xl text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-secondary/50 group"
          >
            <Github className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
