import RegisterScreen from "@/components/RegisterScreen";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    navigate("/");
  };

  return <RegisterScreen onRegisterSuccess={handleRegisterSuccess} />;
};

export default Register;
