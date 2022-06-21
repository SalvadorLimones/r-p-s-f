import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";

const Dashboard = () => {
  const { get, post } = todoApi();
  const [users, setUsers] = useState([]);
  const { user: me } = useAuth();

  const getUsers = async () => {
    const resp = await get("/user/users");
    if (resp?.status === 200) {
      setUsers(resp.data);
    }
  };
  const getStatus = (user, i) => {
    const friend = user.friends.find((friend) => friend.friendId === me.userId);
    const status = friend?.friendStatus;

    if (status === 0) return "Request sent";
    if (status === 1) return "Request received";
    if (status === 2) return "Friend";
    return "Stranger";
  };

  const friendly = async (id) => {
    await post("friend/add", { userId: id });
    getUsers();
  };

  const unfriendly = async (id) => {
    await post("friend/remove", { userId: id });
    getUsers();
  };

  const usersData = (user, i) => {
    const status = getStatus(user, i);

    return (
      <>
        {user._id !== me.userId && (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{user.username}</td>
            <td> {user.played}</td>
            <td> {user.won}</td>
            <td> {user.won ? (user.won / user.played) * 100 : 0} </td>
            <td>
              <button onClick={() => friendly(user._id)}>:)</button>
            </td>
            <td>
              <button onClick={() => unfriendly(user._id)}>:(</button>
            </td>
            <td>{status}</td>
          </tr>
        )}
      </>
    );
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h3>Dashboard</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Played</th>
            <th>Won</th>
            <th>Win%</th>
            <th>+</th>
            <th>-</th>
            <th>Friend Status</th>
          </tr>
        </thead>
        <tbody>{users && users.map((user, i) => usersData(user, i))}</tbody>
      </table>
    </div>
  );
};

export default Dashboard;
