import {arrayDeepCopy} from "./calculatePossibleMoves";

function renderBoard(boardCopy, isRed) {
  let board = arrayDeepCopy(boardCopy);
  if (!isRed) {
    board = board.reverse();
    for (let i = 0; i < board.length; i++) {
      board[i] = board[i].reverse();
    }
  }
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      let squareId = String(i) + String(j);
      const parentSquare = document.getElementById(squareId);
      parentSquare.innerHTML = "";
      let squareClass = board[i][j];
      if (squareClass !== "e") {
        const childPiece = document.createElement("div");
        childPiece.classList.add("occupied");
        childPiece.classList.add("in-play");
        childPiece.classList.add(squareClass);
        const pieceIdStem = isRed ? (String(i) + String(j)) : (String(board.length - i - 1) + String(board.length - j - 1));
        childPiece.setAttribute("id", pieceIdStem + "child");
        parentSquare.appendChild(childPiece);
      }
    }
  }
}


export default renderBoard;
