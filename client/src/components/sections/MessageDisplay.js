import React from "react";

function MessageDisplay(props) {
  return (
    <div className="message-display">
      {
        props.displayReminder &&
          <p className="user-display text-center">
            Reminder: you can end your turn here by clicking on the current piece
          </p>
      }
      {
        props.displayWinner &&
            <p className="winner-display user-display text-center">
              Congratulations!!  You've won!
            </p>
      }
      {
        props.displayLoser &&
          <p className="loser-display user-display text-center">
            Game Over
          </p>
      }
    </div>
  );
}

export default MessageDisplay;
