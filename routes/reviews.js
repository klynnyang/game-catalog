var express = require('express');
var router = express.Router();
const reviewsCtrl = require('../controllers/reviews');

router.get("/games/:id/new", isLoggedIn, reviewsCtrl.new);
router.post("/games/:id/reviews", isLoggedIn, reviewsCtrl.create);
router.delete("/games/:id/reviews/:rid", isLoggedIn, reviewsCtrl.delete)

module.exports = router;

function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated() ) return next();
    res.redirect("/users/login");
  }