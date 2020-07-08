const passport = require("passport");
const router = require("express").Router();

router.route("/").post((req, res) => {
  //allow cookies
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  //returns an object indicating success of logout
  req.logout();
  const responseObject = {logoutWasSuccess: true};
  res.json(responseObject);
});

module.exports = router;
