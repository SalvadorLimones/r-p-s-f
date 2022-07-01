import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useNavigate } from "react-router-dom";

const Championship = () => {
  const { get, post } = todoApi();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const joinOrCreate = async () => {
    let resp;
    resp = await post("/game/join");
    if (resp.status === 404) resp = await post("game/start/championship");
    if (resp.status === 200) navigate("/game/?id=" + resp.data._id);
    console.log("JOINED GAME: ", resp);
  };

  const getUsers = async () => {
    const resp = await get("/user/users");
    if (resp?.status === 200) {
      setUsers(resp.data);
    }
  };

  const renderUser = (user, i) => {
    console.log(user);
    return (
      <tr key={i}>
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
      <button onClick={() => joinOrCreate()}>Ready to Play!</button>
      <h3>Leaderboard</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Played</th>
            <th>Won</th>
            <th>Win%</th>
          </tr>
        </thead>
        <tbody> {users && users.map((user, i) => renderUser(user, i))} </tbody>
      </table>
    </div>
  );
};

export default Championship;
