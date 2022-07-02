import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Playground from "./Playground";
import { randomClassName } from "../hooks/randomClassName";

const Friends = () => {
  const [page, setPage] = useState(1);
  return (
    <div>
      <div className={randomClassName("top")}></div>
      <div className={randomClassName("bottom")}></div>
      <h3>{page === 1 ? "Dashboard" : "Playground"}</h3>
      <button
        className={page === 1 ? "friends-button selected" : "friends-button"}
        onClick={() => setPage(1)}
      >
        Dashboard
      </button>
      <button
        className={page === 2 ? "friends-button selected" : "friends-button"}
        onClick={() => setPage(2)}
      >
        Playground
      </button>
      {page === 1 && <Dashboard />}
      {page === 2 && <Playground />}
    </div>
  );
};

export default Friends;
