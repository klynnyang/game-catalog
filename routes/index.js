var express = require("express");
var router = express.Router();
const passport = require("passport")
const Game = require("../models/game");

/* GET home page. */
router.get("/", function(req, res, next) {
  Game.find({"reviews.0": {$exists: true}}, function(err, games) {
    res.render("index", { 
      title: "Games Catalog", 
      user: req.user,
      games
    });
  }).sort({"reviews.createdAt": 1});
});

router.get("/users/login", function(req, res) {
  res.render("users/login", {
    message: req.flash("error"),
    title: "Login Page",
    user: req.user
  })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login",
  failureFlash: true 
}));

router.get("/auth/google", passport.authenticate(
  "google",
  {scope: ["profile", "email"]}
))

router.get("/oauth2callback", passport.authenticate(
  "google",
  {
    successRedirect : "/games",
    failureRedirect : "/login"
  }
));

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/games");
});


module.exports = router;
