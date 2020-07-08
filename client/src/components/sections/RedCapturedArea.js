import React from "react";
import RedCapturedHolder from "../cells/RedCapturedHolder";

function RedCapturedArea() {
  const NUMBER_OF_CELLS = 12;
  const mapper = [];
  for (let i = 0; i < NUMBER_OF_CELLS; i++) {
    mapper.push(i);
  }
  return (
    <div className="captured-container captured-container-red">
      {mapper.map(i => <RedCapturedHolder id={"rch" + i} key={i}/>)}
    </div>
  );
}

export default RedCapturedArea;
