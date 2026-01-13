import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">What are you tryna find?</p>
        <a href="/" className="text-blue-600 underline hover:text-blue-800">
          Go back home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
