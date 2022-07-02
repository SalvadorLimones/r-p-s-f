import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";
import { useNavigate } from "react-router-dom";

let getFriendsList;
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
    const resp = await post("/game/join", { gameId: id });
    if (resp.status === 200) navigate("/game/?id=" + resp.data._id);
    console.log("JOINED GAME: ", resp);
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
              <button
                disabled={user.invited || !user.online || user.playing}
                onClick={() => invite(user._id)}
              >
                INVITE
              </button>
            </td>
            <td>
              <button
                disabled={!user.invited || !user.online || user.playing}
                onClick={() => accept(user.invited)}
              >
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
    getFriendsList = setInterval(getFriends, 5000);
    return () => {
      clearInterval(getFriendsList);
    };

    // eslint-disable-next-line
  }, []);

  return (
    <div className="table-page">
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
        <tbody>
          {users && (
            <>
              {users
                .filter((user) => user.invited)
                .map((user, i) => usersData(user, i))}

              {users
                .filter((user) => !user.invited)
                .map((user, i) => usersData(user, i))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Playground;
