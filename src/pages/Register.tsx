import { useNavigate } from "react-router-dom";
import RegisterScreen from "@/components/RegisterScreen";

const Register = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (email: string) => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_user_email", email);
    window.location.href = "/";
  };

  const handleSwitchToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <RegisterScreen
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default Register;
