
var router = require('express').Router();
const users = require("../controllers/users.controller.js");
const validator = require("../validation/validator.js");
const userSchema = require("../validation/user.schema.js");

// login
router.post("/login", validator(userSchema.login), users.findOrCreate);
router.post("/otpLogin", validator(userSchema.otpLogin), users.otpLogin);

router.post("/refreshToken", users.refreshToken);
// router.post("/register", validator(userSchema.login), authentication.register);

module.exports = router;