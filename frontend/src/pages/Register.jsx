import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth";

const Register = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { register, user } = useAuth();

  useEffect(() => {
    if (user.userId) navigate("/rules");
    // eslint-disable-next-line
  }, [user]);

  return (
    <div>
      Register
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={() => register(username)}>Register</button>
    </div>
  );
};

export default Register;
