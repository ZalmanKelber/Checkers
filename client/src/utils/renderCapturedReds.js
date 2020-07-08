const TOTAL_PIECES = 12;

function renderCapturedReds(capturedReds, isRed) {
  for (let i = 0; i < TOTAL_PIECES; i++) {
    let cellId = isRed ? "rch" + i : "bch" + (12 - i - 1);
    const parentSquare = document.getElementById(cellId);
    parentSquare.innerHTML = "";
    parentSquare.classList.remove("occupied-holder");
    if (i < capturedReds) {
      const childPiece = document.createElement("div");
      childPiece.classList.add("occupied");
      childPiece.classList.add("r");
      parentSquare.classList.add("occupied-holder");
      parentSquare.appendChild(childPiece);
    }
  }
}

export default renderCapturedReds;
