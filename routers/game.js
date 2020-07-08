const router = require("express").Router();
const passport = require("passport");
let Game = require("../models/game.model");
let User = require("../models/user.model");

router.route("/:gameurl").get((req, res) => {
  //allow cookies
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  //return object will have six values.  The first will indicate whether the game was found.
  //The second will indicate whether or not the user has the authentication status necessary to access the game.
  //The third will indicate whether or not the user, if logged in, has access to the game.
  //The fourth will indicate whether or not the user has been added to a game.
  //The fifth will be the game object itself, set to null if any of the first three conditions aren't met
  //The sixth will be the user object that contains user information
  const responseObject = { //initiates response Object with default values
    gameFound: false,
    authenticationStatus: false,
    isPlayer: false,
    newToGame: false,
    gameObject: null,
    userObject: {authenticated: false, userId: "0", username: "guest user"}
  }

  //locate the game from the database
  Game.findById(req.params.gameurl, (err, currentGame) => {
    if (err) {
      console.log(err);
    }
    if (!currentGame) { //confirms that game exists
      console.log("couldn't find game");
      res.json(responseObject);
    } else {
      responseObject.gameFound = true;

      //determine user authentication status, update the user object, and determine whether or not user has access based on authentication status
      let username = "guest user";
      let userId = "0";

      if (req.isAuthenticated()) {
        username = req.user.username;
        userId = req.user._id;
        responseObject.userObject.authenticated = true;
        responseObject.userObject.userId = userId;
        responseObject.userObject.username = username;
      }


      if (userId === "0" && currentGame.registered) {
        res.json(responseObject);
      } else {
        responseObject.authenticationStatus = true;

        //determine if the user is one of the game players
        const gameUser1 = currentGame.user1;
        const gameUser2 = currentGame.user2;
        if (currentGame.gameStatus !== "initiated" && userId != gameUser1 && userId != gameUser2) {
          res.json(responseObject);
        } else {
          responseObject.isPlayer = true;
          responseObject.gameObject = currentGame;

          //determine if user is joining the game for the first time
          if ((currentGame.user1 && userId == currentGame.user1) || (currentGame.user2 && userId == currentGame.user2)) {
            res.json(responseObject);
          } else {
            responseObject.newToGame = true;

            //add user to game and return updated object
            //first define function that updates game
            function addUserToGame() {
              const newPlayerPosition = currentGame.user1 ? "user2" : "user1"; //determines which slot hasn't yet been filled
              const newPlayerPositionName = currentGame.user1name ? "user2name" : "user1name";
              Game.updateOne({
                _id: req.params.gameurl
              }, { //changes game status to active and adds current user to game
                [newPlayerPosition]: userId,
                [newPlayerPositionName]: username,
                gameStatus: "active"
              }, err => {
                console.log(err);
              });
              //now update the new user's info
              //add the game ID to the user document if the user is registered
              User.updateOne(
                { _id: userId },
                { $push: {games: gameId} },
                err => console.log(err));

              return;
            }
            //call the function and, upon completion, add the updated game object to the response object and send
            try {
              addUserToGame()
            } catch (err) {
              console.log(err);
            } finally {
              Game.findById(req.params.gameurl, (err, newCurrentGame) => {
                if (err) {
                  console.log(err);
                } else {
                  responseObject.gameObject = newCurrentGame;
                  res.json(responseObject);
                }
              });
            }
          }
        }
      }
    }
  });
});

module.exports = router;
