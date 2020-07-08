const router = require("express").Router();
let Game = require("../models/game.model");
let User = require("../models/user.model");

router.route("/:userurl").get((req, res) => {
    //allow cookies
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    const responseObject = {
      lookupWasSuccess: false,
      gamesInfo: []
    }

    const userId = req.params.userurl;

    //determine if user is logged in and matches the userId that was sent with the request
    if (req.user && req.user._id == userId) {
      addGamesToArray();
    }
    else {
      console.log("couldn't authenticate user");
      res.json(responseObject);
    }

    //define the function that adds game info to the gamesArray array in responseObject
    function addGamesToArray() {
      User.findById(userId, (err, currentUser) => {
        if (err) {
          console.log(err);
        }
        if (!currentUser) { //confirms that game exists
          console.log("couldn't find user");
          res.json(responseObject);
        } else {
          responseObject.lookupWasSuccess = true;
          const gameDataArray = [];
          const gameIdList = currentUser.games;
          gameIdList.forEach(gameId => {
            Game.findById(gameId, (err, currentGame) => {
              if (err) {
                console.log(err);
              }
              if (!currentGame) {
                console.log("couldn't locate game for gameId " + gameId);
              }
              else {
                const gameStatus = currentGame.gameStatus;
                const redPlayer = currentGame.user2name;
                const blackPlayer = currentGame.user1name;
                const winner = (currentGame.gameStatus == "completed") ?
                        ((currentGame.numberOfMoves % 2 === 0) ? currentGame.user2name : currentGame.user1name) :
                        "–";
                const gameData = {
                  gameId: gameId,
                  gameStatus: gameStatus,
                  redPlayer: redPlayer,
                  blackPlayer: blackPlayer,
                  winner: winner
                }
                gameDataArray.push(gameData);
              }
            });
          });
          setTimeout(function () {
            responseObject.gamesInfo = gameDataArray;
            res.json(responseObject);
          }, 2000);
        }
      });
    }
});

module.exports = router;
