import React from "react";

function BoardSquare(props) {
  return (
    <div className={"square " + props.color} id={props.id}>
    </div>
  );
}

export default BoardSquare;
