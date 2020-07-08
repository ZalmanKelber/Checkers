const router = require("express").Router();
const passport = require("passport");
let Game = require("../models/game.model");
let User = require("../models/user.model");
const updateGameValues = require("../utils/updateGameValues");
const generateNewMove = require("../utils/generateNewMove");

router.route("/:gameurl").post((req, res) => {
  //allow cookies
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  //return object will have four values.  The first will indicate whether the game was found.
  //The second will indicate whether or not the user has the authentication status necessary to access the game.
  //The third will indicate whether or not the user, if logged in, has access to the game.
  //If these conditions hold, the game will be updated and if the opponent is the computer, a new move will be generated
  //and added as well.  The fourth value will indicate whether or not the call was a success
  const responseObject = { //initiates response Object with default values
    gameFound: false,
    authenticationStatus: false,
    isPlayer: false,
    updateWasSuccess: false
  }

  //locate the game from the database
  Game.findById(req.params.gameurl, (err, currentGame) => {
    if (err) {
      console.log(err);
    }
    if (!currentGame) { //confirms that game exists
      res.json(responseObject);
    } else {
      responseObject.gameFound = true;

      //determine user authentication status and whether or not user has access based on authentication status
      let userId = "0";
      if (req.isAuthenticated()) {
        userId = req.user._id;
      }
      if (userId === "0" && currentGame.registered) {
        res.json(responseObject);
      } else {
        responseObject.authenticationStatus = true;


        //determine if the user is one of the game players
        if (currentGame.gameStatus !== "initiated" && userId != currentGame.user1 && userId != currentGame.user2) {
          res.json(responseObject);
        } else {
          responseObject.isPlayer = true;

          //add updateBoard function as a method to current Gaame object and use it to update its values

          //the user submitted move will be stringified, so we will need to put it back into the right format
          //start by removing everything in the string that is not a digit and splitting the remainders into an array
          let strMove = "" + req.body.move;

          let arr = strMove.split(/[^0-9]/);
          //make sure everything in our array is a digit
          arr = arr.filter(entry => entry.length > 0);
          //now add them into the moves array
          const userMove = [];
          for (let i = 0; i < arr.length; i += 2) {
            userMove.push([Number(arr[i]), Number(arr[i + 1])]);
          }



          const newGameValues = updateGameValues(currentGame, userMove);
          currentGame.currentBoard = newGameValues.newBoard;
          currentGame.currentCapturedReds = newGameValues.newReds;
          currentGame.currentCapturedBlacks = newGameValues.newBlacks;
          currentGame.numberOfMoves = newGameValues.newMoves;

          //define the function that updates the game in the database
          function updateGame() {

            return Game.updateOne({
              _id: req.params.gameurl
            }, { //updates game object values
              currentBoard: currentGame.currentBoard,
              currentCapturedReds: currentGame.currentCapturedReds,
              currentCapturedBlacks: currentGame.currentCapturedBlacks,
              numberOfMoves: currentGame.numberOfMoves
            }, err => {
              console.log(err);
            });
          }

          //define the function that generates a new move from the computer and updates it
          function newComputerMove() {
            const nextMove = generateNewMove(currentGame);
            const newestGameValues = updateGameValues(currentGame, nextMove);
            currentGame.currentBoard = newestGameValues.newBoard;
            currentGame.currentCapturedReds = newestGameValues.newReds;
            currentGame.currentCapturedBlacks = newestGameValues.newBlacks;
            currentGame.numberOfMoves = newestGameValues.newMoves;
            updateGame();
          }

          //the updateGame function should return a promise that we can use to make sure newComputerMove is called subsequently
          updateGame().then(() => {
            if (currentGame.user1 === "1" || currentGame.user2 === "1") { //determine if the opponent is the computer
              newComputerMove();
            }
            responseObject.updateWasSuccess = true;
            res.json(responseObject);
          }).catch(err => {
            console.log(err);
            res.json(responseObject);
          });



        }
      }
    }
  });
});

module.exports = router;
