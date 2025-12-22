import { Download, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Header Component
 * Site header with logo and navigation
 * Uses glassmorphism for a modern look
 */
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
            <span className="font-display font-bold text-lg text-primary-foreground">X</span>
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
            className="gap-2 hover:scale-105 transition-transform duration-300"
          >
            <a
              href="https://github.com/hevji/xyfen-backend/releases/download/Backend/backend.py"
              download
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Backend</span>
            </a>
          </Button>

          {/* GitHub Link */}
          <a
            href="https://github.com/hevji"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-all duration-300 p-2 rounded-lg hover:bg-secondary hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
          >
            <Github className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;