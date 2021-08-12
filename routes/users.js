var express = require("express");
var router = express.Router();
const passport = require("passport")
const userCtrl = require("../controllers/users");


router.get("/login", userCtrl.loginPage);
router.get("/signup", userCtrl.new);
router.post("/", userCtrl.validationRules(), userCtrl.validate, userCtrl.create);
router.get("/:id",userCtrl.show);
router.post("/upload", userCtrl.upload)


module.exports = router;