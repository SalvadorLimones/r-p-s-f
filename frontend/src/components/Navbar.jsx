import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { useVisible } from "../providers/visible";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, token, logout } = useAuth();
  const { navVisible, selected, setSelected } = useVisible();
  const nav = (path) => {
    navigate(path);
  };

  return (
    navVisible && (
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          padding: " 10px 200px",
        }}
      >
        <div>
          {!token && (
            <button
              className={selected === "home" && "selected"}
              onClick={() => {
                setSelected("home");
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
                  navigate("/championship");
                }}
              >
                Championship
              </button>
              <button
                className={selected === "friends" && "selected"}
                onClick={() => {
                  setSelected("friends");
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
    )
  );
};

export default Navbar;
