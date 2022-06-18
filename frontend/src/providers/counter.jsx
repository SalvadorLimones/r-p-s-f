import { React, useState, useContext, createContext } from "react";

const CounterContext = createContext();

const CounterProvider = ({ children }) => {
  const [value, setValue] = useState(0);
  const [valueHome, setValueHome] = useState(0);
  const [valueProfile, setValueProfile] = useState(0);

  const increment = (param) => {
    if (!param) setValue(value + 1);
    if (param === "home") setValueHome(valueHome + 1);
    if (param === "profile") setValueProfile(valueProfile + 1);
  };
  const decrement = (param) => {
    if (!param) setValue(value - 1);
    if (param === "home") setValueHome(valueHome - 1);
    if (param === "profile") setValueProfile(valueProfile - 1);
  };
  const contextValue = { value, valueHome, valueProfile, increment, decrement };

  return (
    <div>
      <CounterContext.Provider value={contextValue}>
        {children}
      </CounterContext.Provider>
    </div>
  );
};

const useCounter = () => useContext(CounterContext);

export { CounterProvider, useCounter };
