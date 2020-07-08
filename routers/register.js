const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
let User = require("../models/user.model");

router.route("/").post((req, res, next) => {
  //allow cookies
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  //returns an object with a single value to indicate whether registration was successful
  const responseObject = {registerWasSuccess: false}; //set default value


  User.register({username: req.body.username, email: req.body.email, games: []}, req.body.password, (err, newUser) => {
    if (err) {
      res.json(responseObject);
      console.log(err);
    }
    else {
      let authenticate = User.authenticate();
      authenticate(req.body.username, req.body.password, (err, result) => {
        if (err) {
          console.log(err);
          res.json(responseObject);
        }
        if (result) {
          req.login(result, (err) => {
            if (err) {
              return next(err);
            }
            responseObject.registerWasSuccess = true;
            req.session.save();
            return res.json(responseObject);
          });
        } else {
          res.json(responseObject);
        }
      });
    }
  });
});

module.exports = router;
