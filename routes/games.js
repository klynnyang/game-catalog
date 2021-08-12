var express = require('express');
var router = express.Router();
const gameCtrl = require("../controllers/games");

router.get("/new", isLoggedIn, gameCtrl.new);
router.post("/", isLoggedIn, gameCtrl.create);
router.get("/", gameCtrl.index);
router.delete("/:id", gameCtrl.delete);
router.get("/:id", gameCtrl.show);
router.post("/:id/likes", gameCtrl.addGame)
router.delete("/:id/likes", gameCtrl.deleteGame)
router.get("/:id/update", gameCtrl.update);
router.put("/:id", gameCtrl.put)

module.exports = router;

function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated() ) return next();
    res.redirect("/users/login");
  }