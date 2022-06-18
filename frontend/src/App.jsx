import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GameRules from "./pages/GameRules";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Callback from "./pages/Callback";
import Protected from "./components/Protected";
import Register from "./pages/Register";
import Championship from "./pages/Championship";
import Friends from "./pages/Friends";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/rules" element={<GameRules />}></Route>
        <Route
          path="/profile"
          element={
            <Protected key={"1"}>
              <Profile />
            </Protected>
          }
        ></Route>
        <Route path="/callback" element={<Callback />}></Route>
        <Route
          path="/register"
          element={
            <Protected key={"2"}>
              <Register />
            </Protected>
          }
        ></Route>
        <Route
          path="/championship"
          element={
            <Protected key={"3"}>
              <Championship />
            </Protected>
          }
        ></Route>
        <Route
          path="/friends"
          element={
            <Protected key={"4"}>
              <Friends />
            </Protected>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
