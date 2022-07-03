import React from "react";
import { randomClassName } from "../hooks/randomClassName";

const Rules = () => {
  return (
    <div>
      <h2>Game rules</h2>
      <div className={randomClassName("position", "top", 2)}></div>
      <div className={randomClassName("position", "bottom", 2)}></div>
    </div>
  );
};

export default Rules;
