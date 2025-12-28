import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Request App to open the login modal and redirect to home,
    // so App.tsx remains the single place rendering modals.
    localStorage.setItem("xyfen_open_login", "true");
    navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default Login;
