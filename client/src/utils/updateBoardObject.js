import {arrayDeepCopy} from "./calculatePossibleMoves";

function updateBoardObject(boardCopy, move, kinged) {
  const board = arrayDeepCopy(boardCopy);
  let pieceType = board[move[0][0]][move[0][1]]; //determines the type of piece making the move
  for (let i = 0; i < move.length; i++) { //makes every square on the moves path empty
    board[move[i][0]][move[i][1]] = "e";
  }
  //next, determine if the piece in question was kinged, and if so, update it
  if (kinged) {
    if (pieceType === "r") {
      pieceType = "rk";
    }
    else {
      pieceType = "bk";
    }
  }
  //now add the piece back to the board
  board[move[move.length - 1][0]][move[move.length - 1][1]] = pieceType;

  //now return the new board
  return board;
}

export default updateBoardObject;
