import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TERMS_TEXT = `Terms of Service

Effective Date: December 23, 2025

Welcome to Xyfen. By accessing or using our website, you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

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
The Service is provided "as-is" and we make no warranties regarding its availability, accuracy, or legality of downloaded content. You assume all responsibility for your use of the Service and the consequences of your actions.

5. Limitation of Liability
Xyfen is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to copyright infringement or misuse of downloaded content.

6. Changes to Terms
We may update these Terms at any time. Continued use of the Service constitutes your acceptance of the revised Terms.


For questions or concerns about these Terms, please contact us at tnzruho@gmail.com.`;

/**
 * Terms of Service Page - Dedicated page for legal terms
 */
const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[500px] bg-accent/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <Header />

      <main className="relative pt-28 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          {/* Terms Content */}
          <div className="glass-strong rounded-2xl p-8 md:p-10 animate-fade-in">
            <h1 className="font-display text-3xl font-bold text-foreground mb-8">
              Terms of Service
            </h1>

            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {TERMS_TEXT}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
