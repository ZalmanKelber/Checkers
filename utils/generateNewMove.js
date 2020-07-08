const calculatePossibleMoves = require("./calculatePossibleMoves");
const arrayDeepCopy = require("./arrayDeepCopy");
const updateBoard = require("./updateBoard");

function generateNewMove(gameObject) {
  //determine first which turn it is
  const isRed = (gameObject.numberOfMoves % 2 === 0) ? false : true;
  const rules = gameObject.rules;
  let currentPossibleMoves = calculatePossibleMoves(gameObject.currentBoard, rules, isRed);
  return bestMove(currentPossibleMoves, gameObject.currentBoard, rules, isRed);
}

function bestMove(moves, boardCopy, rules, isRed) {

  //we will need a local variable keeping track of which turn it is that will change as we calculate subsequent moves
  let localIsRed = isRed;

  //our board will be a copy of the board sent as a parameter so as not to alter it
  const board = arrayDeepCopy(boardCopy);
  const NUM_TURNS = 5;

  //we will create an array of chains, each one representing a sequence of moves, that will be
  //in the form [{move: move, updatedBoard: updated board}, {...}].  We will keep this array of chains
  //within our original moves variable

  for (let i = 0; i < moves.length; i++) {
    moves[i] = [{move: moves[i], updatedBoard: updateBoard(board, moves[i], localIsRed).board}];
  }


  // console.log("total number of move sequences with move length: " + 1);
  // console.log(moves.length);


  //for each i, we will calculate all possible subsequent moves by the opposing player for each of the final moves in
  //the previous round
  for (let i = 0; i < NUM_TURNS - 1; i++) {
    localIsRed = !localIsRed;
    console.log("localIsRed in round " + i + ": " + localIsRed)
    const nextMoves = [];
    for (let j = 0; j < moves.length; j++) {
      const nextBoard = arrayDeepCopy(moves[j][moves[j].length - 1].updatedBoard); //find the most recent board for each chain of move sequences
      let nextBoardMoves = calculatePossibleMoves(nextBoard, rules, localIsRed); //find all possible subsequent moves from the opposing player
      if (nextBoardMoves.length === 0) {
        nextBoardMoves = [[[0, 0], [0, 0]]];
      }
      for (let k = 0; k < nextBoardMoves.length; k++) {
        const nextMove = arrayDeepCopy(nextBoardMoves[k]);
        const moveSequence = arrayDeepCopy(moves[j]);
        moveSequence.push({move: nextMove, updatedBoard: updateBoard(nextBoard, nextMove, localIsRed).board});
        nextMoves.push(moveSequence);
      }
    }
    moves = arrayDeepCopy(nextMoves);
  }

  //add the final scores of each moves sequence, evaluated with respect to the original player
  for (let i = 0; i < moves.length; i++) {
    moves[i]["scores"] = score(moves[i][moves[i].length - 1].updatedBoard, isRed); //note that we use the global isRed variable here
  }

  for (let i = NUM_TURNS - 2; i >= 0; i--) {
    moves.push([0]); //we push the extra value into the moves array so that we can iterate through all values in the moves array by comparing them to the following one
    const narrowerPossibleMoves = [];
    let leaderMoveSequence = moves[0];
    let moveSequenceBundle = [];
    for (let j = 0; j < moves.length; j++) {
      let moveSequence = moves[j];
      let equalPath = true;
      //determine if the current move sequence is the same as the leader move sequence as far as the specified index
      for (let k = 0; k <= i; k++) {
        if (moveSequence.length > 1 && !arrayDeepEqual(moveSequence[i].move, leaderMoveSequence[i].move)) {
          equalPath = false;
        }
      }
      if (moveSequence.length === 1) {
        equalPath = false;
      }
      if (equalPath) {
        moveSequenceBundle.push(moveSequence);
      }
      else {
        let pertinentMoveSequence = moveSequenceBundle[0];
        let pertinentScore = moveSequenceBundle[0]["score"];
        for (let k = 1; k < moveSequenceBundle.length; k++) {
          if ((moveSequenceBundle[k]["score"] < pertinentScore && i % 2 === 0)
                || (moveSequenceBundle[k]["score"] > pertinentScore && i % 2 === 1)) {
                  pertinentScore = moveSequenceBundle[k]["score"];
                  pertientMoveSeqence = moveSequenceBundle[k];
                }
        }
        narrowerPossibleMoves.push(pertinentMoveSequence);
        leaderMoveSequence = moves[j];
        moveSequenceBundle = [];
        moveSequenceBundle.push(moves[j]);
      }
    }
    moves = narrowerPossibleMoves;

  }


  let bestMove = moves[0][0].move;
  let bestPertinentScore = moves[0]["scores"];
    for (let i = 0; i < moves.length; i++) {
        if (moves[i]["scores"] > bestPertinentScore) {
            bestPertinentScore = moves[i]["scores"];
            bestMove = moves[i][0].move;
        }
    }

    const bestMoveCopy = arrayDeepCopy(bestMove);
    return bestMoveCopy;
}

//calculates the total score simply by taking the total number of in-play pieces
//of the player and subtracting the total number of pieces from the opposing player

function score(board, isRed) {
  let score = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      switch (board[i][j]) {
        case "r":
          score += isRed ? 1 : -1;
          break;
        case "b":
          score += isRed ? -1 : 1;
          break;
        case "rk":
          score += isRed ? 2 : -2;
          break;
        case "bk":
          score += isRed ? -2 : 2;
          break;
      }
    }
  }
  return score;
}

function arrayDeepEqual (arr1, arr2) {
    if (!Array.isArray(arr1)) {
        return arr1 === arr2;
    }
    if (!Array.isArray(arr2)) {
        return false;
    }
    if (arr1.length != arr2.length) {
        return false;
    }
    else {
        for (var i = 0; i < arr1.length; i++) {
            if (!arrayDeepEqual(arr1[i], arr2[i])) {
                return false;
            }
        }
        return true;
    }
}

module.exports = generateNewMove;
