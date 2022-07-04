import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";
import { useVisible } from "../providers/visible";
import Timer from "../components/Timer";
import { randomClassName } from "../hooks/randomClassName";

let getGameData;
let keepMePlaying;
const Game = () => {
  const { get, post, del } = todoApi();
  const { user } = useAuth();
  const { setNavVisible } = useVisible();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showPicks, setShowPicks] = useState(false);
  const [pickSent, setPickSent] = useState(false);
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
    setPickSent(false);
    setTimeout(() => {
      setShowPicks(false);
      setShowTimer(true);
    }, 4200);

    // eslint-disable-next-line
  }, [round]);
  useEffect(() => {
    if (finished) {
      setNavVisible(true);
      setShowPicks(false);
      setShowTimer(false);
      setPickSent(true);
    }

    // eslint-disable-next-line
  }, [finished]);

  useEffect(() => {
    setNavVisible(false);
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("id");
    setId(gameId);
    fetch(gameId);
    getGameData = setInterval(() => fetch(gameId), 3000);
    keepMePlaying = setInterval(playing, 10000);
    return () => {
      setNavVisible(true);
      clearInterval(getGameData);
      clearInterval(keepMePlaying);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="game-page">
      <div className={randomClassName("background", "top", 2)}></div>
      <div className={randomClassName("background", "bottom", 2)}></div>
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
              <div className="round">Round {gameStats.round}</div>
              <div>
                <div className="score-container">
                  <div>
                    <h2>{gameStats[me].username}</h2>
                    <h3>{gameStats[me].score}</h3>
                  </div>
                  <div className="game-message-board">
                    <>
                      {gameStats.round > 1 && showPicks && (
                        <div>
                          <p>
                            My pick:{" "}
                            {gameStats.rounds[gameStats.round - 2][me + "Pick"]}
                          </p>
                          <p>
                            Opponents pick:{" "}
                            {
                              gameStats.rounds[gameStats.round - 2][
                                opponent + "Pick"
                              ]
                            }
                          </p>
                        </div>
                      )}
                      {finished && (
                        <div
                          className={
                            gameStats.winner === gameStats[me].id
                              ? randomClassName("decision", "winner", 2)
                              : randomClassName("decision", "loser", 2)
                          }
                        ></div>
                      )}
                      {pickSent && !finished && (
                        <p>Waiting for the other player...</p>
                      )}
                    </>
                  </div>
                  <div>
                    <h2>{gameStats[opponent].username}</h2>
                    <h3>{gameStats[opponent].score}</h3>
                  </div>
                </div>
                {showTimer && !finished && (
                  <Timer gameId={gameStats._id} round={gameStats.round} />
                )}
              </div>
              {showTimer && !finished && !pickSent && (
                <div>
                  <div>
                    <p>Choice:</p>
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
                    <div className="pick-container">
                      <div
                        className={
                          pick === "rock" ? "pick-frame-selected" : "pick-frame"
                        }
                      >
                        <input
                          type="button"
                          name="pick"
                          className="rock"
                          onClick={() => setPick("rock")}
                        />
                      </div>
                      <div
                        className={
                          pick === "paper"
                            ? "pick-frame-selected"
                            : "pick-frame"
                        }
                      >
                        <input
                          type="button"
                          name="pick"
                          className="paper"
                          onClick={() => setPick("paper")}
                        />
                      </div>
                      <div
                        className={
                          pick === "scissors"
                            ? "pick-frame-selected"
                            : "pick-frame"
                        }
                      >
                        <input
                          type="button"
                          name="pick"
                          className="scissors"
                          onClick={() => setPick("scissors")}
                        />
                      </div>
                    </div>
                    <div></div>

                    <p>Future:</p>
                    <div className="pick-container">
                      <div
                        className={
                          future === "rock"
                            ? "future-frame-selected"
                            : "future-frame"
                        }
                      >
                        <input
                          type="button"
                          name="future"
                          className="rock future"
                          onClick={() => setFuture("rock")}
                        />
                      </div>
                      <div
                        className={
                          future === "paper"
                            ? "future-frame-selected"
                            : "future-frame"
                        }
                      >
                        <input
                          type="button"
                          name="future"
                          className="paper future"
                          onClick={() => setFuture("paper")}
                        />
                      </div>
                      <div
                        className={
                          future === "scissors"
                            ? "future-frame-selected"
                            : "future-frame"
                        }
                      >
                        <input
                          type="button"
                          name="future"
                          className="scissors future"
                          onClick={() => setFuture("scissors")}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="submit-button"
                    disabled={pick === "none" || future === "none"}
                    onClick={() => {
                      sendChoice(id, pick, future);
                      setPickSent(true);
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Game;
