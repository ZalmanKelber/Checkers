const arrayDeepCopy = require("./arrayDeepCopy");
const TOTAL_PIECES = 12;


function updateBoard(boardCopy, move, isRed) {
  //create a copy of the board
  const board = arrayDeepCopy(boardCopy);
  let pieceType = board[move[0][0]][move[0][1]]; //determine the type of piece making the move
  for (let i = 0; i < move.length; i++) { //make every square on the move's path empty
    board[move[i][0]][move[i][1]] = "e";
  }

  //next, determine if the piece in question was kinged, and if so, update it
  if ((move[move.length - 1][0] === board.length - 1 && isRed)
      || (move[move.length - 1][0] === 0 && !isRed)) {
    //check to see if the number of pieces on the board is less than 12
    let piecesOnBoard = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === (isRed ? "r" : "b")) {
          piecesOnBoard++;
        }
        if (board[i][j] === (isRed ? "rk" : "bk")) {
          piecesOnBoard += 2;
        }
      }
    }
    var kinged = (piecesOnBoard < TOTAL_PIECES)
  }

  if (kinged) {
    pieceType = isRed ? "rk" : "bk";
  }
  //now add the piece back to the board
  board[move[move.length - 1][0]][move[move.length - 1][1]] = pieceType;

  //now determine the number of pieces that are currently captured
  let capturedReds = capturedBlacks = TOTAL_PIECES;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      switch (board[i][j]) {
        case "r":
          capturedReds--;
          break;
        case "b":
          capturedBlacks--;
          break;
        case "rk":
          capturedReds -= 2;
          break;
        case "bk":
          capturedBlacks -= 2;
      }
    }
  }

  //now return an object containing the board and number of captured pieces
  return {
    board: board,
    capturedReds: capturedReds,
    capturedBlacks: capturedBlacks
  }
}

module.exports =  updateBoard;
