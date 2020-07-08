const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
let User = require("./models/user.model");

const BCRYPT_SALT_ROUNDS = 10;

require("dotenv").config();

const app = express();

const uri = "mongodb+srv://ZalmanKelber:CYDf67957Pa6cL5w@cluster0.9aoks.mongodb.net/checkersprod?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {credentials: true};
app.use(cors(corsOptions));

passport.use("register", new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
    session: false,
  },
  (username, password, done) => {
    try {
      User.findOne({username: username}).then(user => {
        if (user != null) {
          console.log("username already taken");
          return done(null, false, {message: "username already taken"});
        } else {
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
            User.create({
              username: username,
              password: hashedPassword
            }).then(user => {
              console.log("user created");
              return done(null, user);
            });
          });
        }
      });
    } catch (err) {
      done(err);
    }
  }
))

passport.use("login", new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
    session: false,
  },
  (username, password, done) => {
    try {
      console.log("username in login strategy: " + username);
      User.findOne({username: username}).then(user => {
        if (user === null) {
          return done(null, false, {message: "username not found"});
        } else {
          console.log("about to compare: ");
          console.log(password);
          console.log(user);
          bcrypt.compare(password, user.password).then(response => {
            if (response !== true) {
              console.log("invalid password");
              return done(null, false, {message: "invalid password"});
            }
            console.log("user found & authenticated");
            return done(null, user);
          });
        }
      });
    } catch (err) {
      done(err);
    }
  },
));

passport.serializeUser(function(user, done) {
  console.log("serializing user");
  console.log("user.id is: " + user._id);
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    console.log("deserializing user");
    done(err, user);
  });
});

// connect routers to app
const loginRouter = require("./routers/login");
const registerRouter = require("./routers/register");
const logoutRouter = require("./routers/logout");
const gameRouter = require("./routers/game");
const authenticateRouter = require("./routers/authenticate");
const userRouter = require("./routers/user");
const newRouter = require("./routers/new");
const moveRouter = require("./routers/move");
const completeRouter = require("./routers/complete");
app.use("/server/login", loginRouter);
app.use("/server/register", registerRouter);
app.use("/server/logout", logoutRouter);
app.use("/server/game", gameRouter);
app.use("/server/authenticate", authenticateRouter);
app.use("/server/user", userRouter);
app.use("/server/new", newRouter);
app.use("/server/move", moveRouter);
app.use("/server/complete", completeRouter);
// app.use("/archive_authenticate", archive_authenticateRouter);
// app.use("/archive_game", archive_gameRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
