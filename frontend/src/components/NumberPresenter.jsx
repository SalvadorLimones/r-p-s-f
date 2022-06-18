import React from "react";
import { useCounter } from "../CounterProvider";

const NumberPresenter = () => {
  const { value } = useCounter();
  return (
    <div>
      <p>Value: {value}</p>
    </div>
  );
};

export default NumberPresenter;
