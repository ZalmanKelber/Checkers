import React from "react";
import Navbar from "./Navbar";

function TitleArea(props) {

  return (
    <div className="title-area">
      <Navbar isLoggedIn={props.isLoggedIn} game={props.game} username={props.username} />
    </div>
  );
}

export default TitleArea;
