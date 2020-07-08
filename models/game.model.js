const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let startingBoard = [
  ["r","e","r","e","r","e","r","e"],
  ["e","r","e","r","e","r","e","r"],
  ["r","e","r","e","r","e","r","e"],
  ["e","e","e","e","e","e","e","e"],
  ["e","e","e","e","e","e","e","e"],
  ["e","b","e","b","e","b","e","b"],
  ["b","e","b","e","b","e","b","e"],
  ["e","b","e","b","e","b","e","b"]
]

const gameSchema = new Schema({
  user1: String, //note: "0" will indicate an unregistered guest user and "1" will represent the computer
  user1name: String,
  user2: String, //user2 is the red/second player
  user2name: String,
  registered: {type: Boolean, default: false},
  rules: {type: Number, default: 0}, //note: "rules" will accept four values, 0-3, corresponding to the rules key listed below
  numberOfMoves: {type: Number, default: 0},
  currentBoard: {type: Array, default: startingBoard},
  currentCapturedReds: {type: Number, default: 0},
  currentCapturedBlacks: {type: Number, default: 0},
  gameStatus: {type: String, default: "initiated"}
});

//rules key:
//0: move freely
//1: must jump when possible
//2: must jump until end of path when possible
//3: must jump longest possible path

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
