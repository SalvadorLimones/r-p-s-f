import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import UserList from "../components/UserList";

const Dashboard = () => {
  const { get } = todoApi();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const resp = await get("/user/users");
    if (resp?.status === 200) {
      setUsers(resp.data);
    }
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
        <tbody>
          {users && users.map((user, i) => <UserList key={i} user={user} />)}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
