import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Footer Component
 */
const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border/30 py-8 px-4 mt-auto">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          Built with ❤️ using React & Flask
        </p>

        <div className="flex gap-2">
          {/* MIT License Link */}
          <a
            href="https://github.com/hevji/xyfen/blob/main/LICENCE.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 px-4 py-2 rounded-lg hover:bg-secondary/50"
          >
            MIT License
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Terms of Use Link */}
          <Button variant="outline" size="sm" asChild>
            <Link to="/terms-of-service">Terms of Use</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
