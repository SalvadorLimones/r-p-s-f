import React, { useState, useEffect } from "react";
import { todoApi } from "../api/todoApi";
import { useAuth } from "../providers/auth";

const UserList = ({ key, user }) => {
  const { user: me } = useAuth();
  const { post } = todoApi();
  const [friendStatus, setFriendStatus] = useState("");

  //.filter((user) => user._id !== me.userId)

  const getStatus = async () => {
    const friend = user.friends.find((friend) => friend.friendId === me.userId);
    const status = friend?.friendStatus;
    if (!status) setFriendStatus("Stranger");
    if (status === 0) setFriendStatus("Request sent");
    if (status === 1) setFriendStatus("Request received");
    if (status === 2) setFriendStatus("Friend");
  };
  const friendly = async (id) => {
    const resp = await post("friend/add", { userId: id });
  };
  const unfriendly = async (id) => {
    const resp = await post("friend/remove", { userId: id });
  };

  useEffect(() => {
    getStatus();
    console.log(key);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
  }, [friendStatus]);

  return (
    <>
      {user._id !== me.userId && (
        <tr key={key}>
          <td>{key + 1}</td>
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
          <td>{friendStatus}</td>
        </tr>
      )}
    </>
  );
};

export default UserList;
