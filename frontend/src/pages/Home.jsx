import React from "react";
import { useAuth } from "../providers/auth";
import { randomClassName } from "../hooks/randomClassName";

const Home = () => {
  const { auth } = useAuth();
  return (
    <div className="home-page">
      <div>
        <div className={randomClassName("top")}></div>
        <div className={randomClassName("bottom")}></div>
        <div className="logo">
          <p className="please-log-in">
            Please log in with your Google account to play!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
