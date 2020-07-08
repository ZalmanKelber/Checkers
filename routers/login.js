const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").post((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  //initiate the response object, which will contain one value to indicate whether the login was a success
  const responseObject = {
    loginWasSuccess: false
  };

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
        console.log("attempting to respond successfully");
        responseObject.loginWasSuccess = true;
        req.session.save();
        return res.json(responseObject);
      });
    } else {
      res.json(responseObject);
    }
  });

});

module.exports = router;
