import React, { useState, useEffect, useRef } from "react";
import { todoApi } from "../api/todoApi";

let id;
const Timer = ({ gameId, round }) => {
  const start = useRef(Date.now() + 20000);
  const [time, setTime] = useState(20);
  const { post } = todoApi();

  useEffect(() => {
    const loop = () => {
      return setInterval(() => {
        const now = Date.now();
        const secs = (start.current - now) / 1000;
        if (Math.floor(secs) === 0) {
          post("/game/pick/" + gameId, {
            round: round,
            Pick: "none",
            Future: "none",
          });
        }
        setTime(Math.floor(secs));
      }, 1000);
    };
    id = loop();

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      {time >= 0 && `Time left: ${time}`}
      {time < -4 && "Please wait, the other player might have quitted..."}
    </div>
  );
};

export default Timer;
