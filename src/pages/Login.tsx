import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginScreen from "@/components/LoginScreen";
import RegisterScreen from "@/components/RegisterScreen";

const Login = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    window.location.href = "/";
  };

  const handleRegisterSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    window.location.href = "/";
  };

  const handleSwitchToRegister = () => {
    navigate("/register");
  };

  if (showRegister) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      </div>
    );
  }

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
