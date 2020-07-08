const TOTAL_PIECES = 12;

function renderCapturedBlacks(capturedBlacks, isRed) {
  for (let i = 0; i < TOTAL_PIECES; i++) {
    let cellId = isRed ? "bch" + (12 - i - 1) : "rch" + i;
    const parentSquare = document.getElementById(cellId);
    parentSquare.innerHTML = "";
    parentSquare.classList.remove("occupied-holder");
    if (i < capturedBlacks) {
      const childPiece = document.createElement("div");
      childPiece.classList.add("occupied");
      childPiece.classList.add("b");
      parentSquare.classList.add("occupied-holder");
      parentSquare.appendChild(childPiece);
    }
  }
}

export default renderCapturedBlacks;
