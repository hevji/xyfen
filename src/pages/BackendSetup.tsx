import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackendInstructions from "@/components/BackendInstructions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Backend Setup Page - Dedicated page for backend configuration instructions
 */
const BackendSetup = () => {
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

          {/* Page Title */}
          <section className="text-center space-y-4 mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight animate-fade-in">
              Backend Setup
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Configure your local Python Flask server to enable video downloads.
            </p>
          </section>

          {/* Backend Instructions */}
          <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <BackendInstructions />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BackendSetup;
