import React from "react";
import { randomClassName } from "../hooks/randomClassName";

const Rules = () => {
  return (
    <div>
      <h2>Game rules</h2>
      <div className={randomClassName("background", "top", 2)}></div>
      <div className={randomClassName("background", "bottom", 2)}></div>
    </div>
  );
};

export default Rules;
