import React from "react";
import axios from "axios";
import TitleArea from "./TitleArea";
import BlackCapturedArea from "./BlackCapturedArea";
import BoardArea from "./BoardArea";
import RedCapturedArea from "./RedCapturedArea";
import MessageDisplay from "./MessageDisplay"


function GameArea(props) {

  //in this component we pass on the login status and username to the title area and the board
  //and player's color to the board area;


  //we will also define the displayReminder boolean and pass it down through props to message display,
  //while passing down the function that alters it to the board area
  const [displayReminder, setDisplayReminder] = React.useState(false);

  //we'll do the same for displayWinner and displayLoser
  const [displayWinner, setDisplayWinner] = React.useState(false);
  const [displayLoser, setDisplayLoser] = React.useState(false);

  function addReminderFunction() {
    setDisplayReminder(true);
  }
  function removeReminderFunction() {
    setDisplayReminder(false);
  }

  function displayGameEnd(isWinner) {
    if (isWinner) {
      setDisplayWinner(true);
      const winSound = new Audio("http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3");
      winSound.play();
    }
    else {
      setDisplayLoser(true);
      const loseSound = new Audio("http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/theygotcha.ogg");
      loseSound.play();
    }
  }

  return (
    <div className="game-area">
      <TitleArea
        game={props.game}
        isLoggedIn={props.userObject.authenticated}
        username={props.userObject.username}
      />
      <MessageDisplay
        displayReminder={displayReminder}
        displayWinner={displayWinner}
        displayLoser={displayLoser}
        />
      <div className="game-area-inner">
        <BlackCapturedArea />
        <BoardArea
          displayGameEnd={displayGameEnd}
          completeGame={props.completeGame}
          sendMove={props.sendMove}
          addReminderFunction={addReminderFunction}
          removeReminderFunction={removeReminderFunction}
          userObject={props.userObject}
          gameObject={props.gameObject}
          isRed={props.gameObject && props.gameObject.user2 == props.userObject.userId}
        />
        <RedCapturedArea />
      </div>
    </div>
  );
}

export default GameArea;
