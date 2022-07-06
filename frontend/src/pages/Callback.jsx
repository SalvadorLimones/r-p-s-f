import React, { useEffect } from "react";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";
import { useVisible } from "../providers/visible";

const Callback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { setSelected } = useVisible();

  useEffect(() => {
    const loginWithCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        await login(code, "google");
      }
      navigate("/championship");
      setSelected("championship");
    };
    loginWithCode();
    // eslint-disable-next-line
  }, []);
  return <div>Callback</div>;
};

export default Callback;
