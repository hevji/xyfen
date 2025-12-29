import { useNavigate } from "react-router-dom";
import LoginScreen from "@/components/LoginScreen";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    window.location.href = "/";
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
