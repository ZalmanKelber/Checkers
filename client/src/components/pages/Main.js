import React from "react";
import Panel from "../sections/Panel";
import GameArea from "../sections/GameArea"

function Main(props) {
  return (
    <div className="main-container">
      <Panel game={props.game} gameurl={props.gameurl} />
      <GameArea
        completeGame={props.completeGame}
        userObject={props.userObject}
        gameObject={props.gameObject}
        game={props.game}
        sendMove={props.sendMove}
      />
    </div>
  );
}

export default Main;
