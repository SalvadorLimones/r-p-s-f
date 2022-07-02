import React from "react";
import { useAuth } from "../providers/auth";
import { randomClassName } from "../hooks/randomClassName";

const Home = () => {
  const { auth } = useAuth();
  return (
    <div className="home-page">
      <div className={randomClassName("top")}></div>
      <div className={randomClassName("bottom")}></div>
      <div className="logo"></div>
    </div>
  );
};

export default Home;
