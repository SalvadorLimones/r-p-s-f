import { React, useState, useContext, createContext } from "react";

const VisibleContext = createContext();

const VisibleProvider = ({ children }) => {
  const [navVisible, setNavVisible] = useState(true);
  const [selected, setSelected] = useState("home");
  const contextValue = { navVisible, setNavVisible, selected, setSelected };

  return (
    <div>
      <VisibleContext.Provider value={contextValue}>
        {children}
      </VisibleContext.Provider>
    </div>
  );
};

const useVisible = () => useContext(VisibleContext);

export { VisibleProvider, useVisible };
