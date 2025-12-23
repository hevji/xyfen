import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * TermsModal Component
 */
const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const TERMS_TEXT = `Terms of Service

Effective Date: December 23, 2025

Welcome to Xyfen. By accessing or using our website, you agree to comply with and be bound by these Terms of Service (“Terms”). If you do not agree to these Terms, do not use the Service.

1. Use of the Service
Xyfen provides a tool that allows users to download content from online sources for personal use. You agree to use the Service only for lawful purposes and in compliance with all applicable laws.

2. Intellectual Property and Copyright
You acknowledge that content available through the Service may be protected by copyright or other intellectual property laws. You agree not to:

-Download content that you do not have the right to access.

-Distribute, repost, sell, or share downloaded content without the permission of the copyright owner.

-Use the Service for any illegal or unauthorized purpose.

-The Service is intended for personal, non-commercial use only. Respect the rights of content creators.

3. Prohibited Conduct
When using the Service, you agree not to:

-Violate any applicable laws or regulations.

-Upload, post, or distribute any content that infringes on intellectual property rights.

-Use the Service to harass, abuse, or harm others.

-Attempt to interfere with the proper functioning of the Service.

4. Disclaimer
The Service is provided “as-is” and we make no warranties regarding its availability, accuracy, or legality of downloaded content. You assume all responsibility for your use of the Service and the consequences of your actions.

5. Limitation of Liability
[Your Website Name] is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to copyright infringement or misuse of downloaded content.

6. Changes to Terms
We may update these Terms at any time. Continued use of the Service constitutes your acceptance of the revised Terms.


For questions or concerns about these Terms, please contact us at tnzruho@gmail.com.`;

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

            {/* Terms of Use Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Terms of Use
            </Button>
          </div>
        </div>
      </footer>

      {isModalOpen && <TermsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Footer;
