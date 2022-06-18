import { useState, useEffect } from "react";

export const useCounter = (componentName) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    localStorage.setItem("counter" + componentName, counter);
    // eslint-disable-next-line
  }, [counter]);

  useEffect(() => {
    const localCounter = parseInt(
      localStorage.getItem("counter" + componentName, counter)
    );
    setCounter(localCounter);
    // eslint-disable-next-line
  }, []);

  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter - 1);

  return { counter, increment, decrement };
};
