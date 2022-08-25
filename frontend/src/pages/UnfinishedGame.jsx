import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVisible } from "../providers/visible";

const UnfinishedGame = () => {
  const navigate = useNavigate();
  const { setNavVisible, selected } = useVisible();

  useEffect(() => {
    setNavVisible(false);
    setTimeout(() => {
      navigate("/" + selected);
      setNavVisible(true);
    }, 15000);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="register-page">
      <h4>
        You might have recently participated in a game which hasn't been
        finished. You will be able to start or join another game only after the
        unfinished game has been deleted. This happens automatically 30 minutes
        after it has started. Please return later!
      </h4>
    </div>
  );
};

export default UnfinishedGame;
