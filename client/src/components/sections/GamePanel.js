import React from "react";

function GamePanel(props) {
  const [redirect, setRedirect] = React.useState(false);
  function redirectHome() {
    setRedirect(true);
  }

  return (
    <form className="home-panel">
        <p className="textarea game-panel-element text-center" variant="outline-dark" type="radio" name="gameType" defaultChecked value="0" disabled>
          Use the following url to access this game in the future:
        </p>
      <p className="textarea game-panel-element text-center">http://localhost:3000/game/{props.gameurl}</p>
    </form>
  );
}

export default GamePanel;
