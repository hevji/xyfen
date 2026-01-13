import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center px-4">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-yellow-400 animate-pulse">
          404
        </h1>
        <p className="mt-4 text-xl text-gray-300">
          Oops! Page not found
        </p>
        <p className="mt-2 text-gray-400">
          The page <span className="font-mono">{location.pathname}</span> does not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-600 transition-all duration-300 transform hover:-translate-y-1"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
