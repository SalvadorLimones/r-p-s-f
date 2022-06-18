import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../providers/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, token, logout } = useAuth();
  const nav = (path) => {
    console.log("routing");
    navigate(path);
  };
  return (
    <nav
      style={{
        backgroundColor: "grey",
        display: "flex",
        justifyContent: "space-between",
        padding: " 10px 30px",
      }}
    >
      <div>
        <button onClick={() => nav("/")}>Home</button>
        <button onClick={() => nav("/rules")}>Game Rules</button>
        {token && (
          <>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => navigate("/championship")}>
              Championship
            </button>
            <button onClick={() => navigate("/friends")}>Friends</button>
            {/* <Link to="/profile">Profile</Link> */}
          </>
        )}
      </div>
      <div>
        {!token ? (
          <button onClick={auth}>Login</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
