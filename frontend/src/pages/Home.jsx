import React from "react";
import { randomClassName } from "../hooks/randomClassName";

const Home = () => {
  return (
    <div className="home-page">
      <div>
        <div className={randomClassName("background", "top", 2)}></div>
        <div className={randomClassName("background", "bottom", 2)}></div>
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
