import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../providers/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, token, logout } = useAuth();
  const nav = (path) => {
    navigate(path);
  };
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        padding: " 10px 200px",
      }}
    >
      <div>
        {!token && <button onClick={() => nav("/")}>Home</button>}
        <button onClick={() => nav("/rules")}>Rules</button>
        {token && (
          <>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => navigate("/championship")}>
              Championship
            </button>
            <button onClick={() => navigate("/friends")}>Friends</button>
            <button onClick={logout}>Logout</button>
            {/* <Link to="/profile">Profile</Link> */}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
