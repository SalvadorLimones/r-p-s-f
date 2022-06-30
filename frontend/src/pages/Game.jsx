import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";

let getGameData;
let keepMePlaying;
const Game = () => {
  const { get, post, del } = todoApi();
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showPicks, setShowPicks] = useState(false);
  const [round, setRound] = useState(0);
  const [me, setMe] = useState("");
  const [opponent, setOpponent] = useState("");
  const [id, setId] = useState("");
  const [gameStats, setGameStats] = useState({});
  const [pick, setPick] = useState("none");
  const [future, setFuture] = useState("none");
  const navigate = useNavigate();

  const playing = async () => {
    console.log("playing!");
    const resp = await post("/user/loggedin", { playing: true });
    if (resp.status !== 200) {
      clearInterval(keepMePlaying);
    }
  };

  const assignRoles = (playerOne) => {
    if (user.userId === playerOne.id) {
      setMe("playerOne");
      setOpponent("playerTwo");
    } else {
      setMe("playerTwo");
      setOpponent("playerOne");
    }
  };

  const fetch = async (gameId) => {
    const resp = await get("/game/" + gameId);
    console.log("GAMEDATA: ", resp.data);
    if (resp.status !== 200) {
      clearInterval(getGameData);
      navigate("/friends");
    }
    if (resp.data.started) setStarted(true);
    if (resp.data.round === 1) {
      assignRoles(resp.data.playerOne);
      setShowTimer(true);
    }
    if (resp.data.round !== round) setRound(resp.data.round);

    if (resp.data.finished) {
      setFinished(true);
      clearInterval(getGameData);
    }
    setGameStats(resp.data);
  };

  const cancel = async (gameId) => {
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
    setPick("none");
    setFuture("none");
    //setShowTimer(false);
  };

  useEffect(() => {
    setShowPicks(true);
    setShowTimer(false);
    setTimeout(() => {
      setShowPicks(false);
      setShowTimer(true);
    }, 3000);

    // eslint-disable-next-line
  }, [round]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("id");
    setId(gameId);
    fetch(gameId);
    getGameData = setInterval(() => fetch(gameId), 3000);
    keepMePlaying = setInterval(playing, 10000);
    return () => {
      clearInterval(getGameData);
      clearInterval(keepMePlaying);
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
                <h2>{gameStats[me].username}</h2>
                <h3>{gameStats[me].score}</h3>
              </div>
              {showPicks && gameStats.round > 1 && (
                <div>
                  <p>
                    My pick:{" "}
                    {gameStats.rounds[gameStats.round - 2][me + "Pick"]}
                  </p>
                  <p>
                    Opponents pick:{" "}
                    {gameStats.rounds[gameStats.round - 2][opponent + "Pick"]}
                  </p>
                </div>
              )}

              {showTimer && (
                <Timer gameId={gameStats._id} round={gameStats.round} />
              )}

              <div>
                <h2>{gameStats[opponent].username}</h2>
                <h3>{gameStats[opponent].score}</h3>
              </div>
            </div>
            {showTimer && (
              <div>
                {" "}
                <div>
                  {gameStats.round > 1 && (
                    <p>
                      Avoid:{" "}
                      {
                        gameStats.rounds[gameStats.round - 2][
                          opponent + "Future"
                        ]
                      }
                    </p>
                  )}
                  <p>Choice:</p>
                  <input
                    type="radio"
                    name="pick"
                    onClick={() => setPick("rock")}
                  />
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
                  disabled={pick === "none" || future === "none"}
                  onClick={() => sendChoice(id, pick, future)}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Game;
