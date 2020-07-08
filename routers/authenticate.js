const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  if (req.isAuthenticated()) {
    const username = req.user.username;
    const userId = req.user._id;
    res.json({  //if user is authenticated, returns a JSON object that contains authentication status id and username
      authenticated: true,
      userId: userId,
      username: username
    });
  }
  else {
    console.log("authentication failed");
     res.json({  //if user is not authenticated, returns a JSON object with authentication status and default values for id and username
       authenticated: false,
       userId: "0",
       username: "guest user"
     });
   }
});

module.exports = router;
