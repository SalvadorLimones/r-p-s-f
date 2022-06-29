import React, { useState, useEffect, useRef } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";
let id;
const Timer = ({ gameId, round }) => {
  const start = useRef(Date.now() + 10000);
  const { user } = useAuth();
  const [time, setTime] = useState(20);
  const { post } = todoApi();

  if (time === 0) {
    clearInterval(id);
    const resp = post("/game/pick/" + gameId, {
      round: round,
      Pick: "none",
      Future: "none",
    });
  }

  useEffect(() => {
    const loop = () => {
      return setInterval(() => {
        const now = Date.now();
        const secs = (start.current - now) / 1000;
        setTime(Math.floor(secs));
      }, 1000);
    };
    id = loop();

    return () => {
      clearInterval(id);
    };
  }, []);

  return <div>Time left: {time}</div>;
};

export default Timer;
