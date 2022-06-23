import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Rules from "./pages/Rules";
import Profile from "./pages/Profile";
import Callback from "./pages/Callback";
import Register from "./pages/Register";
import Championship from "./pages/Championship";
import Friends from "./pages/Friends";
import Game from "./pages/Game";
import Navbar from "./components/Navbar";
import Protected from "./components/Protected";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/rules" element={<Rules />}></Route>
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
        <Route
          path="/game"
          element={
            <Protected key={"5"}>
              <Game />
            </Protected>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
