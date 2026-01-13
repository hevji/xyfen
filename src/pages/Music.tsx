// Music.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Music = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // redirect direct naar home
    navigate("/");
  }, [navigate]);

  return null;
};

export default Music;
