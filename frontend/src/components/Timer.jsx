import React, { useState, useEffect, useRef } from "react";

const Timer = () => {
  const start = useRef(Date.now() + 30000);
  const [time, setTime] = useState(30);

  useEffect(() => {
    const loop = () => {
      return setInterval(() => {
        const now = Date.now();
        const secs = (start.current - now) / 1000;
        setTime(Math.floor(secs));
      }, 1000);
    };
    const id = loop();
    return () => {
      clearInterval(id);
    };
  }, []);
  return <div>Time left: {time}</div>;
};

export default Timer;
