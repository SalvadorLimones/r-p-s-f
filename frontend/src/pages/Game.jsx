import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";

let getGameData;
const Game = () => {
  const { get, post, del } = todoApi();
  const { user: me } = useAuth();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [id, setId] = useState("");
  const [gameStats, setGameStats] = useState({});
  const [pick, setPick] = useState("");
  const [future, setFuture] = useState("");
  const navigate = useNavigate();

  const fetch = async (gameId) => {
    const resp = await get("/game/" + gameId);
    console.log("GAMEDATA: ", resp.data);
    if (resp.status !== 200) {
      clearInterval(getGameData);
      navigate("/friends");
    }
    if (resp.data.started) setStarted(true);
    if (resp.data.finished) {
      setFinished(true);
      clearInterval(getGameData);
    }
    setGameStats(resp.data);
  };

  const cancel = async (gameId) => {
    console.log("GAMEIDTODELETE:", gameId);
    const resp = await del("/game/" + gameId);
    fetch();
  };

  const sendChoice = async (gameId, pick, future) => {
    console.log("PICK: ", pick, "FUTURE: ", future);
    const resp = await post("/game/pick/" + gameId, {
      round: gameStats.round,
      Pick: pick,
      Future: future,
    });
    setPick("");
    setFuture("");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("id");
    setId(gameId);
    fetch(gameId);
    getGameData = setInterval(() => fetch(gameId), 5000);
    return () => {
      clearInterval(getGameData);
    };
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
        gameStats && (
          <div>
            {finished && <h2>DONE!</h2>}
            <div>Round {gameStats.round}</div>
            <div>
              <div>
                <h2>{gameStats.playerOne.username}</h2>
                <h3>{gameStats.playerOne.score}</h3>
              </div>
              <div>
                <h2>{gameStats.playerTwo.username}</h2>
                <h3>{gameStats.playerTwo.score}</h3>
              </div>
            </div>

            <div>
              <p>Avoid: </p>
              <p>Choice:</p>
              <input type="radio" name="pick" onClick={() => setPick("rock")} />
              Rock
              <input
                type="radio"
                name="pick"
                onClick={() => setPick("paper")}
              />
              Paper
              <input
                type="radio"
                name="pick"
                onClick={() => setPick("scissors")}
              />
              Scissors
            </div>
            <div>
              <p>Future:</p>
              <input
                type="radio"
                name="future"
                onClick={() => setFuture("rock")}
              />
              Rock
              <input
                type="radio"
                name="future"
                onClick={() => setFuture("paper")}
              />
              Paper
              <input
                type="radio"
                name="future"
                onClick={() => setFuture("scissors")}
              />
              Scissors
            </div>
            <button
              disabled={!(pick && future)}
              onClick={() => sendChoice(id, pick, future)}
            >
              Submit
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Game;
