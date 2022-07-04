import React from "react";
import { randomClassName } from "../hooks/randomClassName";

const Rules = () => {
  return (
    <div>
      <div className={randomClassName("background", "top", 2)}></div>
      <div className={randomClassName("background", "bottom", 2)}></div>
      <div className="rules-page">
        <h2>Game rules</h2>
        <h3>*Registration*</h3>
        <p>You can register for the game with a Google Account.</p>
        <p>*</p>
        <p>
          When you are signed in, you just have to choose a username, and you
          are ready to play.
        </p>
        <p>*</p>
        <p>
          Next time you wish to return to the page, you just have to sign in to
          your Google Account, and the game will remember your user name and
          results.
        </p>
        <p>***</p>
        <h3>*Rules*</h3>
        <p>
          This game is built on the well-known „rock, paper, scissors” game. The
          basics are the same – rock defeats scissors, scissors defeat paper,
          paper defeats rock. In every round, the one who wins earns one point.
        </p>
        <p>*</p>
        <p>
          But compared to the classical version of the game here you will find
          an extra feature: in every round, you have to pick one of the tools
          for your fellow player that s/he has to avoid in the next round.
        </p>
        <p>*</p>
        <p>
          If s/he – despite the „avoid” sign – chooses that item, you earn half
          a point in that round, no matter who wins the game.
        </p>
        <p>*</p>
        <h4> *The winner*</h4>
        <p>
          The winner is the player who has at least 5 points and at least 1
          point more than the other player.
        </p>
        <p>***</p>
        <h3>*Game types*</h3>
        <h4> *Championship*</h4>
        <p>
          In the Championship by clicking on Ready to Play! you will play with a
          random player who also clicked on the button.
        </p>
        <p>*</p>
        <p>
          Here you can compete with all the other registered players, you can
          check the results on the top list, which you can find by clicking on
          Championship in the menu.
        </p>
        <p>***</p>
        <h4>*Play with friends*</h4>
        <p>To play this version, you need to have Friends first.</p>
        <p>*</p>
        <p>
          By clicking on Friends in the menu you will see all the registered
          players and with the :) sign in the + column you can send a friend
          request to those you wish to.
        </p>
        <p>*</p>
        <p>
          The other player will notice your request in the Friend Status column,
          and if the feelings are mutual, by also clicking on the :) sign s/he
          can approve your request.
        </p>
        <p>*</p>
        <p>
          When you have at least one friend, go to the Playground (under the
          Friends menu), and choose which of your friends you wish to play with.
        </p>
        <p>*</p>
        <p>
          You can invite someone by clicking on the Invite button, and if you
          were invited to a friendly game, you can accept it with the Accept
          button.
        </p>
        <p>***</p>
      </div>
    </div>
  );
};

export default Rules;
