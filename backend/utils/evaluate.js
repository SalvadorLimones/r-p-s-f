const evaluate = (thisRound, prevRound) => {
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
  return { playerOne, playerTwo };
};

module.exports = evaluate;
