import React from "react";
import NumberPresenter from "./NumberPresenter";
import { useCounter } from "../CounterProvider";

const NumberModifyer = () => {
  const { increment, decrement } = useCounter();
  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <NumberPresenter />
    </div>
  );
};

export default NumberModifyer;
