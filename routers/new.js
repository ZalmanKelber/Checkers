const router = require("express").Router();
const passport = require("passport");
let Game = require("../models/game.model");
let User = require("../models/user.model");

router.route("/").post((req, res) => {
  //allow cookies
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  //response will be a single value: game ID.  Initialize it with an empty string
  const responseObject = {
    gameId: ""
  };

  //first determine if user is logged in.  If not, the user ID will be set to the string "0"
  if (req.user) {
    var userId = req.user._id;
    var username = req.user.username;
  } else {
    var userId = "0"; //note that userId is a string, not a number
    var username = "Guest";
}
    console.log(req.body);

    //get other game parameters, being careful to convert them from strings into their proper types
    const isRed = req.body.isRed === "true";
    const againstComputer = req.body.againstComputer === "true";
    const rules = Number(req.body.rules);

    //if user is not logged in but attempting to play against another user, request will fail and return an empty string
    if (userId === "0" && !againstComputer) {
      console.log("user not logged in");
      res.json(responseObject);
    } else {
      //create new game
      let newGame = new Game({});


      //add properties to game
      newGame.registered = userId !== "0";
      newGame.rules = rules; //note that this uses 0-3 corresponding to the four different rule types
      if (isRed) {
        newGame.user2 = userId;
        newGame.user2name = username;
      }
      else {
        newGame.user1 = userId;
        newGame.user1name = username;
      }
      if (againstComputer) {
        isRed ? (newGame.user1 = "1") : (newGame.user2 = "1");
        isRed ? (newGame.user1name = "Computer") : (newGame.user2name = "Computer");
        newGame.gameStatus = "active";
        //if the computer is the starting player, we will initialize the board to show the first move and
        //will set the number of turns equal to 1
        if (isRed) {
          newGame.currentBoard = [
            ["r","e","r","e","r","e","r","e"],
            ["e","r","e","r","e","r","e","r"],
            ["r","e","r","e","r","e","r","e"],
            ["e","e","e","e","e","e","e","e"],
            ["e","e","e","e","b","e","e","e"],
            ["e","b","e","b","e","e","e","b"],
            ["b","e","b","e","b","e","b","e"],
            ["e","b","e","b","e","b","e","b"]
          ];
          newGame.numberOfMoves = 1;
        }
      }
      //save game and return game ID in response
      const gameId = newGame._id;

      newGame.save()
        .catch(err => res.status(400).json(responseObject))
        .then(() => {
          responseObject.gameId = gameId;
          res.json(responseObject);
        });

      //add the game ID to the user document if the user is registered
      if (userId !== "0") {
        User.updateOne(
          { _id: userId },
          { $push: {games: gameId} },
          err => console.log(err));
      }
    }
});

module.exports = router;
