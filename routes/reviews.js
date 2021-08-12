var express = require('express');
var router = express.Router();
const reviewsCtrl = require('../controllers/reviews');

router.get("/games/:id/new", isLoggedIn, reviewsCtrl.new);
router.post("/games/:id/reviews", reviewsCtrl.create);
router.delete("/games/:id/reviews/:rid", reviewsCtrl.delete)

module.exports = router;

function isLoggedIn(req, res, next) {
    if ( req.isAuthenticated() ) return next();
    res.redirect("/users/login");
  }