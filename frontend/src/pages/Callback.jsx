import React, { useEffect } from "react";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loginWithCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        await login(code, "google");
      }
      navigate("/rules");
    };
    loginWithCode();
    // eslint-disable-next-line
  }, []);
  return <div>Callback</div>;
};

export default Callback;
