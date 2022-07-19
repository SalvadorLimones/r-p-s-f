import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { useVisible } from "../providers/visible";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, token, logout } = useAuth();
  const { navVisible, selected, setSelected } = useVisible();
  const [hidden, setHidden] = useState(true);
  const nav = (path) => {
    navigate(path);
  };

  return (
    navVisible && (
      <>
        <div
          className="hamburger-menu"
          onClick={() => setHidden(!hidden)}
        ></div>
        <nav className={!hidden ? "navbar" : "navbar-hidden"}>
          <div>
            {!token && (
              <button
                className={selected === "home" && "selected"}
                onClick={() => {
                  setSelected("home");
                  setHidden(true);
                  nav("/");
                }}
              >
                Home
              </button>
            )}
            <button
              className={selected === "rules" && "selected"}
              onClick={() => {
                nav("/rules");
                setHidden(true);
                setSelected("rules");
              }}
            >
              Rules
            </button>
            {token && (
              <>
                <button
                  className={selected === "championship" && "selected"}
                  onClick={() => {
                    setSelected("championship");
                    setHidden(true);
                    navigate("/championship");
                  }}
                >
                  Championship
                </button>
                <button
                  className={selected === "friends" && "selected"}
                  onClick={() => {
                    setSelected("friends");
                    setHidden(true);
                    navigate("/friends");
                  }}
                >
                  Friends
                </button>
              </>
            )}
            {token ? (
              <button
                onClick={() => {
                  logout();
                  setSelected("home");
                  setHidden(true);
                  navigate("/");
                }}
              >
                Logout
              </button>
            ) : (
              <button onClick={auth}>Login</button>
            )}
          </div>
        </nav>
      </>
    )
  );
};

export default Navbar;
