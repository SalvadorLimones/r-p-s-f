import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";

const Playground = () => {
  const { get, post } = todoApi();
  const [users, setUsers] = useState([]);
  const { user: me } = useAuth();
  const navigate = useNavigate();

  const getFriends = async () => {
    const resp = await get("/user/friends");
    if (resp?.status === 200) {
      console.log("FRIENDS:", resp.data);
      setUsers(resp.data);
    }
  };

  const invite = async (id) => {
    const resp = await post("/game/start/friendly", { userId: id });
    console.log(resp);
    if (resp.status === 200) navigate("/game/?id=" + resp.data._id);
  };

  const accept = async (id) => {
    console.log("ACCEPT");
  };

  const usersData = (user, i) => {
    return (
      <>
        {user._id !== me.userId && (
          <tr key={i}>
            <td>{user.online ? "Yes" : "No"}</td>
            <td>{user.playing ? "Yes" : "No"}</td>
            <td>{user.username}</td>
            <td> {user.played}</td>
            <td> {user.won}</td>
            <td> {user.played - user.won} </td>
            <td>
              <button onClick={() => invite(user._id)}>INVITE</button>
            </td>
            <td>
              <button disabled={!user.invited} onClick={() => accept(user._id)}>
                ACCEPT
              </button>
            </td>
          </tr>
        )}
      </>
    );
  };

  useEffect(() => {
    getFriends();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h3>Playground</h3>
      <table>
        <thead>
          <tr>
            <th>Online</th>
            <th>Playing</th>
            <th>Name</th>
            <th>Played against</th>
            <th>Won</th>
            <th>Lost</th>
            <th>Invite to play</th>
            <th>Accept, start game</th>
          </tr>
        </thead>
        <tbody>{users && users.map((user, i) => usersData(user, i))}</tbody>
      </table>
    </div>
  );
};

export default Playground;
