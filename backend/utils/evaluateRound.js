const evaluateRound = (thisRound, prevRound) => {
  let playerOne = 0;
  let playerTwo = 0;

  switch (thisRound.playerOnePick + thisRound.playerTwoPick) {
    case "rockscissors":
    case "scissorspaper":
    case "paperrock":
    case "rocknone":
    case "papernone":
    case "scissorsnone":
      playerOne = playerOne + 1;
      break;
    case "scissorsrock":
    case "paperscissors":
    case "rockpaper":
    case "nonerock":
    case "nonepaper":
    case "nonescissors":
      playerTwo = playerTwo + 1;
      break;
  }

  if (prevRound) {
    if (
      thisRound.playerTwoPick !== "none" &&
      thisRound.playerTwoPick === prevRound.playerOneFuture
    )
      playerOne = playerOne + 0.5;
    if (
      thisRound.playerOnePick !== "none" &&
      thisRound.playerOnePick === prevRound.playerTwoFuture
    )
      playerTwo = playerTwo + 0.5;
  }

  return { playerOne, playerTwo };
};

module.exports = evaluateRound;
