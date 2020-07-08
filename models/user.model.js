const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  games: [{
              type: String
          }]
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

module.exports = User;
