import React from "react";
import BoardSquare from "../cells/BoardSquare";
import renderBoard from "../../utils/renderBoard";
import renderCapturedReds from "../../utils/renderCapturedReds";
import renderCapturedBlacks from "../../utils/renderCapturedBlacks";
import calculatePossibleMoves from "../../utils/calculatePossibleMoves";
import updatePossibleMoves from "../../utils/updatePossibleMoves";
import updateBoardObject from "../../utils/updateBoardObject";

let startingBoard = [
  ["e","e","e","e","e","e","e","e"],
  ["e","e","e","e","e","e","e","e"],
  ["e","e","e","e","e","e","e","e"],
  ["e","e","e","e","e","e","e","e"],
  ["e","e","e","e","e","e","e","e"],
  ["e","e","e","e","e","e","e","e"],
  ["e","e","e","e","e","e","e","e"],
  ["e","e","e","e","e","e","e","e"],
]

//use global variables within this module to keep track of the class names of the selected piece
//as well as the selected piece itself
let selectedClassNames;
let selectedPiece;


function BoardArea(props) {
  const isRed = props.isRed;
  console.log(isRed);
  const [board, setBoard] = React.useState((props.gameObject && props.gameObject.currentBoard) || startingBoard);
  const [capturedReds, setCapturedReds] = React.useState((props.gameObject && props.gameObject.currentCapturedReds) || 0);
  const [capturedBlacks, setCapturedBlacks] = React.useState((props.gameObject && props.gameObject.currentCapturedBlacks) || 0);


  //the isTurn variable will keep track of whether it is the user's turn
  const [isTurn, setIsTurn] = React.useState(false);

  //currentPath variable will keep track of current path in turn so far
  const [currentPath, setCurrentPath] = React.useState([]);

  //rules will keep track of the rules
  const [rules, setRules] = React.useState(0);

  //possibleMoves varilable will be set to the possible moves at the beginning of a turn
  //we will not modify it during the course of the turn but rather modify the remainingPossibleMoves variable
  const [possibleMoves, setPossibleMoves] = React.useState([]);

  const [remainingPossibleMoves, setRemainingPossibleMoves] = React.useState([]);

  //every time the game object in props changes, we use useEffect to reset the board as well as the isTurn variable
  React.useEffect(() => {
    setBoard(props.gameObject && props.gameObject.currentBoard);
    setCapturedReds(props.gameObject && props.gameObject.currentCapturedReds);
    setCapturedBlacks(props.gameObject && props.gameObject.currentCapturedBlacks);
    setRules(props.gameObject && props.gameObject.rules);
    setCurrentPath([]);

  }, [props.gameObject]);

  //when the board updates, use useEffect to re-render it
  React.useEffect(() => {
    console.log("about to call renderBoard with the following value for isRed:");
    console.log(isRed);
    board && renderBoard(board, isRed);

    //determine if it's the user's turn
    const movesModTwo = (props.gameObject && props.gameObject.numberOfMoves) % 2;
    console.log("movesModTwo:");
    console.log(movesModTwo);
    console.log("isRed:");
    console.log(isRed);
    if ((movesModTwo == 0 && !isRed) || (movesModTwo == 1 && isRed)) {
      console.log("setting turn true");
      setIsTurn(true);
      const movesArray = calculatePossibleMoves(board, rules, isRed);
      //if there are no possible moves, we initiate the end of the game, setting the isWinner parameter as false
      if (movesArray.length === 0) {
        handleEndOfGame(false);
      }

      setCurrentPath([]);
      setPossibleMoves(movesArray);
      console.log("setting remainingPossibleMoves with the following moves: ");
      console.log(movesArray);
      setRemainingPossibleMoves(movesArray);
    }
    else {
      console.log("setting turn false");
      setIsTurn(false);
    }

  }, [board]);

  //when the number of captured reds updates, use useEffect to re-render the captured reds section
  React.useEffect(() => {
    capturedReds && renderCapturedReds(capturedReds, isRed);
  }, [capturedReds]);

  //when the number of captured blacks updates, use useEffect to re-render the captured blacks section
  React.useEffect(() => {
    capturedBlacks && renderCapturedBlacks(capturedBlacks, isRed);
  }, [capturedBlacks]);

  //update the remainingPossibleMoves variable when currentPath is altered
  React.useEffect(() => {
    const newRemainingMoves = updatePossibleMoves(possibleMoves, currentPath, rules);
    //if there are no remaining moves, handle the end of turn
    if (newRemainingMoves.length === 0 && currentPath.length > 0) {
      handleEndOfTurn();
    }
    else if (currentPath.length !== 0 || possibleMoves.length !== 0){
      setRemainingPossibleMoves(newRemainingMoves);
    }
  }, [currentPath]);


  //next, use useEffect to change the pieces that are draggable whenever possibleMoves changes
  React.useEffect(() => {
    remainingPossibleMoves && makeDraggable(remainingPossibleMoves);
  }, [remainingPossibleMoves]);

  //define the function that modifies playable pieces to be draggable
  function makeDraggable(moves) {
    const activePieces = document.querySelectorAll(".in-play");
    for (let i = 0; i < activePieces.length; i++) {
      const pieceId = activePieces[i].getAttribute("id");
      let match = false;
      for (let j = 0; j < moves.length; j++) {
        if (Number(pieceId.charAt(0)) === moves[j][0][0] && Number(pieceId.charAt(1)) === moves[j][0][1]) {
          match = true;
          //if the move only has a length of 1, add the click event to it and set the reminder display to
          //allow the user to end the turn by clicking on the piece
          if (moves[j].length === 1) {
            activePieces[i].addEventListener("click", handleClick);
            props.addReminderFunction();
          }
        }
      }
      if (match) {

        //add event listeners to pieces that can make legal moves
        activePieces[i].setAttribute("draggable", true);
        activePieces[i].addEventListener("dragstart", () => {
          dragStartFunction(moves, activePieces[i]);
        });
        activePieces[i].addEventListener("dragend", dragEndFunction);
      }
      else {
        activePieces[i].setAttribute("draggable", false);
      }
    }
  }


  //the drag start function will alter the selected piece while also adding event listeners
  //to the squares to which it can move
  function dragStartFunction(moves, selectedElement) {
    //store the className attributes of the selected item and the item itself in the module's global variable
    selectedClassNames = selectedElement.className;
    selectedPiece = selectedElement;

    //alter the selected element and add event listeners to the target squares to which it can move
    selectedElement.classList.add("hold");
    const currentId = selectedElement.getAttribute("id");
    const nextPositionIds = nextPositionsInTurn(moves, currentId);
    selectSquares(nextPositionIds);

  }

  //the drag end function will remove all event listeners
  function dragEndFunction() {
      this.classList.remove("hold");
      setTimeout(() => {
          // this.style.visibility="visible";
          selectedPiece = null;
          const unoccupiedList = document.querySelectorAll(".black");
          for (const empty of unoccupiedList) {
              empty.removeEventListener("dragover", dragOverFunction);
              empty.removeEventListener("dragenter", dragEnterFunction);
              empty.removeEventListener("dragleave", dragLeaveFunction);
              empty.removeEventListener("drop", dropFunction);
          }
      }, 0);
  }


  //the selectSquares function will add event listeners to the squares to which the selected piece
  //can legally move
  function selectSquares(positionIds) {
    for (let i = 0; i < positionIds.length; i++) {
      const targetSquare = document.getElementById(positionIds[i]);
      targetSquare.addEventListener("dragover", dragOverFunction);
      targetSquare.addEventListener("dragenter", dragEnterFunction);
      targetSquare.addEventListener("dragleave", dragLeaveFunction);
      targetSquare.addEventListener("drop", dropFunction);
    }
  }

  //define the event listeners for the selected target squares
  function dragOverFunction(e) {
      e.preventDefault();
  }

  function dragEnterFunction(e) {
      e.preventDefault();
      this.classList.add("hover");
  }

  function dragLeaveFunction() {
      this.classList.remove("hover");
  }

  function handleClick(e) {
    e.preventDefault();
    handleEndOfTurn();
  }

  //the drop function will handle the end of the leg of the turn
  function dropFunction(e) {
      e.preventDefault();

      //if there any click event listeners that are listening for the end of a turn, remove them:
      const piecesList = document.querySelectorAll(".in-play");
      for (const inPlay of piecesList) {
          inPlay.removeEventListener("click", handleClick);
      }

      //if there was a message reminding us to click on a piece, remove it
      props.removeReminderFunction();

      this.classList.remove("hover");
      let newPositionIdStem = this.getAttribute("id");
      if (selectedPiece) {
        selectedPiece.className = selectedClassNames;
        const oldPositionIdStem = selectedPiece.getAttribute("id").slice(0, 2);
        if (!isRed) {
          newPositionIdStem = String(board.length - 1 - Number(newPositionIdStem.charAt(0)))
                + String(board.length - 1 - Number(newPositionIdStem.charAt(1)));
        }
        selectedPiece.setAttribute("id", newPositionIdStem + "child");
        this.append(selectedPiece);
        selectedPiece = null;
        //now define the path of the current leg that we can use to update the current path
        const oldPosition = [Number(oldPositionIdStem.charAt(0)), Number(oldPositionIdStem.charAt(1))];
        const newPosition = [Number(newPositionIdStem.charAt(0)), Number(newPositionIdStem.charAt(1))];
        if (oldPosition[0] - newPosition[0] === 1 || oldPosition[0] - newPosition[0] === -1) {
          addCurrentPath([oldPosition, newPosition]);
        }
        else {
          const middlePosition = [((oldPosition[0] + newPosition[0]) / 2), ((oldPosition[1] + newPosition[1]) / 2)];
          addCurrentPath([oldPosition, middlePosition, newPosition]);
          capturePiece(middlePosition);
        }
      }
  }

  //define the function that will update the current path.  This will triger a changing of the remaining possible moves
  function addCurrentPath(segment) {
    //if the current path is zero, we add all of the positions in segment to it
    if (currentPath.length === 0) {
      const newPath = [...currentPath, ...segment];
      setCurrentPath(newPath);
    }
    //otherwise, we only want to add the last two positions of a three position segment
    else {
      const newPath = [...currentPath, segment[1], segment[2]];
      setCurrentPath(newPath);
    }
  }

  //now define the function that updates the number of captured pieces, triggering a re-rendering of the captured area
  function capturePiece(middlePosition) {
    const y = isRed ? middlePosition[0] : board.length - 1 - middlePosition[0];
    const x = isRed ? middlePosition[1] : board.length - 1 - middlePosition[1];

    //first remove the captured piece from the board
    const squaredId = String(y) + String(x);
    const parentSquare = document.getElementById(squaredId);
    parentSquare.innerHTML = "";


    //determine the kind of piece that was captured and update the number of captured pieces
    const pieceType = board[y][x];
    const currentReds = capturedReds;
    const currentBlacks = capturedBlacks;
    switch (pieceType) {
      case "r":
        setCapturedReds(currentReds + 1);
        break;
      case "rk":
        setCapturedReds(currentReds + 2);
        break;
      case "b":
        setCapturedBlacks(currentBlacks + 1);
        break;
      case "bk":
        setCapturedBlacks(currentBlacks + 2);
    }
  }




  //define the function that takes the current id of the selected piece and outputs the id's of the
  //board squares to which the piece can legally move
  function nextPositionsInTurn(moves, currentId) {

    //first extract the position from the piece's id
    const y = Number(currentId.charAt(0));
    const x = Number(currentId.charAt(1));
      const positions = [];

      //identify the moves that begin at the specified position
      for (let i = 0; i < moves.length; i++) {
          if (moves[i][0][0] === y && moves[i][0][1] === x && moves[i].length > 1) {
              if (moves[i].length > 2) {
                  positions.push(moves[i][2]);
              }
              else {
                  positions.push(moves[i][1]);
              }
          }
      }
      const positionIds = []
      for (let i = 0; i < positions.length; i++) {
          const newId = isRed
            ? (String(positions[i][0]) + String(positions[i][1]))
            : (String(board.length - 1 - positions[i][0]) + String(board.length - 1 - positions[i][1]));
          if (positionIds.indexOf(newId) < 0) {
            positionIds.push(newId);
          }
      }
      console.log(positionIds);
      return positionIds;
  }


  function handleEndOfTurn() {
    console.log("handle end of turn called");
    //first we have to determine if the player has been kinged by checking the final position
    let kinged = false;
    if (currentPath[currentPath.length - 1][0] === (isRed ? board.length - 1 : 0)) {
      const capturedReserve = isRed ? capturedReds : capturedBlacks;
      if (capturedReserve >= 1) {
        handleKing(currentPath[currentPath.length - 1]);
        kinged = true;
      }
    }
    //next, update the board and determine the possible moves of the opponent to see if the game is over
    const newBoard = updateBoardObject(board, currentPath, kinged);
    //use this new board to calculate the opponent's next possible moves
    const opponentMoves = calculatePossibleMoves(newBoard, rules, !isRed);
    //if the opponent has no possible moves, trigger the end of the game with isWinner set to true
    if (opponentMoves.length === 0) {
      handleEndOfGame(true);
    }
    //set isTurn to false
    setIsTurn(false);
    setRemainingPossibleMoves([]);
    //finally, send the move to the database through an API call, using the current path
    props.sendMove(currentPath);
  }

  function handleKing(position) {
    const currentCaptured = isRed ? capturedReds : capturedBlacks;
    if (isRed) {
      setCapturedReds(currentCaptured - 1);
    }
    else {
      setCapturedBlacks(currentCaptured - 1);
    }
    const pieceId = String(position[0]) + String(position[1]) + "child";
    const kingedPiece = document.getElementById(pieceId);
    const classToRemove = isRed ? "r" : "b";
    const classToAdd = isRed ? "rk" : "bk";
    kingedPiece.classList.remove(classToRemove);
    kingedPiece.classList.add(classToAdd);
  }

  function handleEndOfGame(isWinner) {
    console.log("handleEndOfGame called from within BoardArea component");
    props.completeGame();
    props.displayGameEnd(isWinner);
  }


  //create the actual permanent board on top of which the pieces specified in the board variable will sit
  const boardSquares = [];
  const BOARD_LENGTH = 8;
  for (let i = BOARD_LENGTH - 1; i >= 0; i--) {
    for (let j = 0; j < BOARD_LENGTH; j++) {
      let id = String(i) + String(j);
      if (i % 2 === 1) {
        var color = (j % 2 === 1) ? "black" : "red";
      } else {
        color = (j % 2 === 1) ? "red" : "black";
      }
      boardSquares.push({id: id, color: color});
    }
  }

  return (
    <div className="board-outer-container">
      <div className="board-inner-container">
        <div className="board">
          {
            boardSquares.map(square => {
              return (
                <BoardSquare
                  color={square.color}
                  id={square.id}
                  key={square.id}
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

export default BoardArea;
