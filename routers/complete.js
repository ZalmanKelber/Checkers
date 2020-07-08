const router = require("express").Router();
const passport = require("passport");
let Game = require("../models/game.model");
let User = require("../models/user.model");

router.route("/:gameurl").post((req, res) => {
  //allow cookies
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  //This API call simply changes the status of the game document to "completed" and returns
  //an object with a single parameter indicating whether or not the update was successful.
  //The winner of the archived game can be determined by the numberOfMoves property at the end of the game
  //(odd --> black wins, even --> red wins)
  const responseObject = {
    updateWasSuccess: false
  };

  //locate the game from the database
  Game.findById(req.params.gameurl, (err, currentGame) => {
    if (err) {
      console.log(err);
    }
    if (!currentGame) { //confirms that game exists
      res.json(responseObject);
    }

    //determine user authentication status and whether or not user has access based on authentication status
    if (req.user) {
      var userId = req.user._id;
    } else {
      var userId = "0"; //note that userId is a string, not a number
    }
    if (userId === "0" && currentGame.registered) {
      res.json(responseObject);
    }

    //determine if the user is one of the game players
    if (userId !== currentGame.user1 && userId != currentGame.user2) {
      res.json(responseObject);
    }

    //update the Game and return the response
    //first define function that updates game
    function completeGame() {
      return Game.updateOne({
        _id: req.params.gameurl
      }, { //changes game status to complete and adds winner to game
        gameStatus: "completed"
      }, err => {
        console.log(err);
      });
    }
    //call the function and, upon completion, add the updated game object to the response object and send
    completeGame().then(() => {
        responseObject.updateWasSuccess = true;
        res.json(responseObject);
      })
      .catch(err => console.log(err));

  });
});

module.exports = router;
