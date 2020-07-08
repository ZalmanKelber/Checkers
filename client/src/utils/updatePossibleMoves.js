function updatePossibleMoves(moves, path, rules) {
  console.log("updatePossibleMoves called with path and moves: ");
  console.log(path);
  console.log(moves);

  if (path.length === 0) {
    return moves;
  }
  const newMoves = [];

  //for the moves greater or equal to the path length, see if they begin with the path, and if so, push
  //their remaining legs into the newMoves array
  for (let i = 0; i < moves.length; i++) {
    if (moves[i].length >= path.length) {
      let match = true;
      for (let j = 0; j < path.length; j++) {
        if (path[j][0] != moves[i][j][0] || path[j][1] != moves[i][j][1]) {
          match = false;
        }
      }
      if (match) {

        //note that we push the move starting from the last position of the current path and not after
        newMoves.push(moves[i].slice(path.length - 1, moves[i].length));
      }
    }
  }
  //if there is only one possible move and it is of length 1, we can remove it.
  //returning an empty array will trigger the end of turn handler function
  if (newMoves.length === 1 && newMoves[0].length === 1) {
    return [];
  }
  return newMoves;
}

export default updatePossibleMoves;
