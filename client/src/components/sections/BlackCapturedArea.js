import React from "react";
import BlackCapturedHolder from "../cells/BlackCapturedHolder";

function BlackCapturedArea() {
  const NUMBER_OF_CELLS = 12;
  const mapper = [];
  for (let i = 0; i < NUMBER_OF_CELLS; i++) {
    mapper.push(i);
  }
  return (
    <div className="captured-container captured-container-black">
      {mapper.map(i => <BlackCapturedHolder id={"bch" + i} key={i}/>)}
    </div>
  );
}

export default BlackCapturedArea;
