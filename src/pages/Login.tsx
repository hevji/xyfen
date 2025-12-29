import { useNavigate } from "react-router-dom";
import LoginScreen from "@/components/LoginScreen";
import { setAuthCookie } from "@/lib/cookies";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Set all auth indicators
    setAuthCookie(true);
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    navigate("/", { replace: true });
  };

  const handleSwitchToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </div>
  );
};

export default Login;
