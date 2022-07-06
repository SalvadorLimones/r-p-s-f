import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useNavigate } from "react-router-dom";
import { randomClassName } from "../hooks/randomClassName";
import { useAuth } from "../providers/auth";

const Championship = () => {
  const { get, post } = todoApi();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { user: me } = useAuth();

  const joinOrCreate = async () => {
    let resp;
    resp = await post("/game/join");
    if (resp.status === 404) resp = await post("game/start/championship");
    if (resp.status === 200) navigate("/game/?id=" + resp.data._id);
  };

  const getUsers = async () => {
    const resp = await get("/user/users");
    if (resp?.status === 200) {
      setUsers(resp.data);
    }
  };

  const renderUser = (user, i) => {
    return (
      <tr key={i} className={user.username === me.username ? "selected" : ""}>
        <td>{i + 1}</td>
        <td>{user.username}</td>
        <td> {user.played}</td>
        <td> {user.won}</td>
        <td> {user.won ? ((user.won / user.played) * 100).toFixed(2) : 0} </td>
      </tr>
    );
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className={randomClassName("background", "top", 2)}></div>
      <div className={randomClassName("background", "bottom", 2)}></div>
      <h3>Leaderboard</h3>
      <button className="play-button" onClick={() => joinOrCreate()}>
        Ready to Play!
      </button>
      <div className="table-page-parent">
        <div className="table-page">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Played</th>
                <th>Won</th>
                <th>Win%</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user, i) => renderUser(user, i))}{" "}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Championship;
