import React from "react";
import { randomClassName } from "../hooks/randomClassName";

const Rules = () => {
  return (
    <div>
      <h2>Game rules</h2>
      <div className={randomClassName("top")}></div>
      <div className={randomClassName("bottom")}></div>
    </div>
  );
};

export default Rules;
