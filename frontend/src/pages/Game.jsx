import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";

let getGameData;
const Game = () => {
  const { get, post, del } = todoApi();
  const { user: me } = useAuth();
  const [started, setStarted] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const fetch = async (gameId) => {
    const resp = await get("/game/" + gameId);
    console.log("GAMEDATA: ", resp.data);
    if (resp.data.started) setStarted(true);
    if (resp.status !== 200) {
      clearInterval(getGameData);
      navigate("/friends");
    }
  };

  const cancel = async (gameId) => {
    const resp = await del("/game/" + gameId);
    console.log(resp);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("id");
    setId(gameId);
    fetch(gameId);
    getGameData = setInterval(() => fetch(gameId), 5000);
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      {!started ? (
        <div>
          <h2>Waiting for other player to join..</h2>
          <button onClick={() => cancel(id)}>Cancel</button>
        </div>
      ) : (
        <div>Game on!</div>
      )}
    </div>
  );
};

export default Game;
