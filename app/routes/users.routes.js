
var router = require('express').Router();
const users = require("../controllers/users.controller.js");
const validator = require("../validation/validator.js");
const userSchema = require("../validation/user.schema.js");
const middleware = require("../config/middleware.js");


//update profile

router.get("/", middleware.verifyAdminToken, users.findAll);

router.post("/update", middleware.verifyToken, validator(userSchema.updateProfile), users.updateProfile);



router.post("/admin", middleware.verifyAdminToken, validator(userSchema.create), users.createAadmin);

router.put("/admin/:id", middleware.verifyAdminToken, validator(userSchema.update), users.updateAdmin);

//...

// router.post("/register", validator(userSchema.login), authentication.register);

// // api/products/:id
// router.get('/:id', function(req, res) {
//   res.json({ id: req.params.id });
// });  

module.exports = router;