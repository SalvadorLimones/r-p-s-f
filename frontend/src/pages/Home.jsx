import React from "react";
//import { useCounter } from "../hooks/useCounter";
import { useCounter as useGlobalCounter } from "../providers/counter";
import { useAuth } from "../providers/auth";

const Home = () => {
  //const { counter, increment, decrement } = useCounter();
  const {
    value,
    valueHome,
    increment: goUp,
    decrement: goDown,
  } = useGlobalCounter();
  const { auth, token } = useAuth();
  return (
    <div className="home-page">
      <div className="background-top"></div>
      <div className="background-bottom"></div>
      <div className="logo"></div>
      <button onClick={auth}>Login</button>
      {/*       <div>Home</div>
      <p>{token ? "Logged in" : "Anonymus user"}</p>
      <h3>Local counter:</h3>
      <p>{valueHome}</p>
      <button onClick={() => goDown("home")}>-</button>
      <button onClick={() => goUp("home")}>+</button>
      <h3>Global counter:</h3>
      <p>{value}</p>
      <button onClick={() => goDown()}>-</button>
      <button onClick={() => goUp()}>+</button>
      {!token ? <button onClick={auth}>Login</button> : "Welcome!"} */}
    </div>
  );
};

export default Home;
