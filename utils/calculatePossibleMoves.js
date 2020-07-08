const arrayDeepCopy = require("./arrayDeepCopy")

function calculatePossibleMoves(boardCopy, rules, isRed) {
  //before we start, create a copy of the board that we will use to calculate moves on
  //in order to prevent errors resulting from simultaneous function calls
  const board = arrayDeepCopy(boardCopy);

  //each piece will be an object with two values: a position (an array with an x and y value)
  //and a boolean, isKing
  const pieces = [];

  //add all available pieces to pieces array
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === (isRed ? "r" : "b")) {
        pieces.push({
          position: [i, j],
          isKing: false
        });
      }
      if (board[i][j] === (isRed ? "rk" : "bk")) {
        pieces.push({
          position: [i, j],
          isKing: true
        });
      }
    }
  }

  //next, calculate all possible moves for each piece and add them to a moves array
  const moves = [];
  for (let i = 0; i < pieces.length; i++) {
    const movesForPiece = findMoves(board, isRed, pieces[i]);
    movesForPiece.forEach(move => moves.push(move));
  }
  moves.sort();

  return modifyMoves(moves, rules);
}



//takes the set of all possible moves and filters them based on which rules are selected
//rules = 0: move freely
//rules = 1: must jump if possible
//rules = 2: must jump to end of path
//rules = 3: must jump longest path
function modifyMoves(moves, rules) {
  //if the rules allow us to move freely, we don't need to  modify the moves
  if (rules === 0) {
    return moves;
  }

  //otherwise, begin by calculating the longest move
  const modifiedMoves = [];
  let longestMoveLength = 0;
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].length > longestMoveLength) {
      longestMoveLength = moves[i].length;
    }
  }
  //if no moves involve jumps, we are done
  if (longestMoveLength === 2) {
    return moves;
  }

  //if we have to jump the longest path, only return moves with length longestMoveLength
  if (rules === 3) {
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].length === longestMoveLength) {
        modifiedMoves.push(moves[i]);
      }
    }
    return modifiedMoves;
  }

  //if we must jump, then any move with length greater than 2 will be allowed
  const filteredMoves = moves.filter(move => move.length > 2);
  if (rules === 1) {
    return filteredMoves;
  }

  //finally, if we must jump to the end of the path, we delete those mvoes that don't complete their possible path
  //we take advantage of the fact that the moves are already sorted
  const fullPathMoves = [];
  for (var i = 0; i < moves.length - 1; i++) {

    //if the following move in the moves array is larger, we make sure the move isn't a subset of the following one
    //before adding it
    if (moves[i].length < moves[i + 1].length) {
      if ((!isSubset(moves[i], moves[i + 1])) && moves[i].length > 2) {
        fullPathMoves.push(moves[i]);
      }
    }
    //otherwise, we add the move if it has length greater than two
    else if (moves[i].length > 2) {
      fullPathMoves.push(moves[i]);
    }
  }
  //we add the final move in the moves array, which is guaranteed not to be a subset
  if (moves[moves.length - 1].length > 2) {
    fullPathMoves.push(moves[moves.length - 1]);
  }
  return fullPathMoves;

}




//finds moves for a given individual piece
function findMoves(board, isRed, piece, captured = []) {
  const moves = [];

  //the direction options are the directions a piece can legally move in, with [1,1] equal to "up, right";
  let directionOptions;
  if (piece.isKing) {
    directionOptions = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1]
    ];
  } else {
    directionOptions = isRed ? [
      [1, 1],
      [1, -1]
    ] : [
      [-1, 1],
      [-1, -1]
    ];
  }
  const startPosition = [piece.position[0], piece.position[1]];

  //remove piece from board temporarily so that it can possibly end up in the same position
  board[startPosition[0]][startPosition[1]] = "e";

  //iterate through the direction options to find all possible adjacent squares
  for (let i = 0; i < directionOptions.length; i++) {


    const adjacent = [startPosition[0] + directionOptions[i][0], startPosition[1] + directionOptions[i][1]];
    if (onBoard(adjacent, board.length)) {

      //if the adjacent square is empty and there are no captured pieces (meaning we are at the beginning of the hypothetical  move),
      //add the move from the start position to the adjacent position to the moves array
      if (board[adjacent[0]][adjacent[1]] === "e" && captured.length === 0) {
        moves.push([startPosition, adjacent]);

      }


      //next, determine if the adjacent square contains an opponent's piece that has not already been captured this turn
      if (doesntContain(captured, adjacent) &&
        (board[adjacent[0]][adjacent[1]] === (isRed ? "b" : "r") || board[adjacent[0]][adjacent[1]] === (isRed ? "bk" : "rk"))) {
        //calculate the landing position if the piece in the starting to position were to jump over
        //the opponent's piece and determine if it is empty

        const landingPosition = [adjacent[0] + directionOptions[i][0], adjacent[1] + directionOptions[i][1]];

        if (onBoard(landingPosition, board.length) && board[landingPosition[0]][landingPosition[1]] === "e") {
          const moveSegment = [startPosition, adjacent, landingPosition];
          moves.push(moveSegment);
          //add the jumped over piece to an array called nextCaptured and add the already captured pieces to it
          const nextCaptured = [adjacent];
          for (let j = 0; j < captured.length; j++) {
            nextCaptured.push(captured[j]);
          }
          //initialize "travelingPiece" which will be sent to findMoves again in order to find the
          //subsequent legs of all possible moves
          const travelingPiece = {
            position: landingPosition,
            isKing: piece.isKing
          };
          const nextJumps = findMoves(board, isRed, travelingPiece, nextCaptured);
          //now add each subsequent leg to the current leg and push the resulting chain into the moves array
          for (let j = 0; j < nextJumps.length; j++) {
            const nextMove = [startPosition, adjacent];
            for (let k = 0; k < nextJumps[j].length; k++) {
              nextMove.push(nextJumps[j][k]);
            }
            moves.push(nextMove);
          }
        }
      }
    }
  }
  //add starting piece back onto board (if it is the true starting piece, which is when captured has length 0) and return the moves array
  const pieceType = piece.isKing ? (isRed ? "rk" : "bk") : (isRed ? "r" : "b");
  if (captured.length === 0) {
    board[startPosition[0]][startPosition[1]] = pieceType;
  }
  return moves;
}




//the following are smaller helper functions

//determines if the first of two move inputs is a subset of the second
function isSubset(move1, move2) {
  for (let i = 0; i < move1.length; i++) {
    if (move1[i][0] != move2[i][0] || move1[i][1] != move2[i][1]) {
      return false;
    }
  }
  return true;
}

//determines if a position is on the board (as opposed to out of bounds)
function onBoard(position, boardLength) {
  const onBoard = position[0] >= 0 && position[0] < boardLength && position[1] >= 0 && position[1] < boardLength;
  return onBoard;
}

//determines if a list of positions contains a specified position
//we use this to avoid jumping over the same piece in an infinite loop in the rare event this is possible
function doesntContain(listOfPositions, position) {
  for (let i = 0; i < listOfPositions.length; i++) { //iterate through positions to see if the specified position is among them
    if (listOfPositions[i][0] === position[0] && listOfPositions[i][1] === position[1]) {
      return false;
    }
  }
  return true;
}

module.exports = calculatePossibleMoves;
