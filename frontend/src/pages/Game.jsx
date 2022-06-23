import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";

let getGameData;
const Game = () => {
  const { get, post } = todoApi();
  const { user: me } = useAuth();
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  const fetch = async (id) => {
    const resp = await get("/game/" + id);
    console.log("GAMEDATA: ", resp.data);
    if (resp.data.started) setStarted(true);
    if (resp.status !== 200) {
      clearInterval(getGameData);
      navigate("/friends");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    fetch(id);
    getGameData = setInterval(() => fetch(id), 5000);
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      {!started ? (
        <div>
          <h2>Waiting for other player to join..</h2>
          <button>Cancel</button>
        </div>
      ) : (
        <div>Game on!</div>
      )}
    </div>
  );
};

export default Game;
