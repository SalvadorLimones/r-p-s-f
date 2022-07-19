import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth";

const Register = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { register, user, taken, setTaken } = useAuth();

  useEffect(() => {
    if (user.userId) navigate("/championship");
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="register-page">
      <h4>
        At first login, you have to register a username. You will need to set it
        only once and the game will remember it. Also, please choose carefully,
        becase you won't be able to change it!
      </h4>
      <div>
        <input
          className="register-input"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setTaken(null);
          }}
        />
        <button
          className="friends-button"
          disabled={username.length < 3 || username.length > 10}
          onClick={() => {
            register(username);
            setUsername("");
          }}
        >
          Register
        </button>
      </div>
      {taken ? (
        <p>{taken}</p>
      ) : (
        (username.length < 3 || username.length > 10) && (
          <p>length has to be between 3 and 10 characters</p>
        )
      )}
    </div>
  );
};

export default Register;
