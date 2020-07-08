const updateBoard = require("./updateBoard");


function updateGameValues(gameObject, move) {
  console.log("update Game Values function called with the following move:");
  console.log(move);
  console.log("and the following board: ");
  console.log(gameObject.currentBoard);
  //determine first if it's the red or black player's turn
  const isRed = (gameObject.numberOfMoves % 2 === 0) ? false : true;

  const updatedBoard = updateBoard(gameObject.currentBoard, move, isRed);

  //create the new values
  const newBoard = updatedBoard.board;
  const newReds = updatedBoard.capturedReds;
  const newBlacks = updatedBoard.capturedBlacks;
  const newMoves = gameObject.numberOfMoves + 1;

  //create the object with the new values
  const returnObject = {
    newBoard: newBoard,
    newReds: newReds,
    newBlacks: newBlacks,
    newMoves: newMoves
  }
  console.log("updateGameValues returning the following board:");
  console.log("newBoard");

  return returnObject;
}

module.exports = updateGameValues;
