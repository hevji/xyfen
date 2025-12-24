import LoginScreen from "@/components/LoginScreen";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    navigate("/");
  };

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
};

export default Login;
