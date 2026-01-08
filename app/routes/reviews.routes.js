
var router = require('express').Router();
const reviews = require("../controllers/reviews.controller.js");
const validator = require("../validation/validator.js");
const reviewsSchema = require("../validation/reviews.schema.js");
const middleware = require("../config/middleware.js");


//update profile

router.get("/:gameId", reviews.findAll);

router.post("/", middleware.verifyToken, validator(reviewsSchema.create), reviews.create);




// router.post("/register", validator(userSchema.login), authentication.register);

// // api/products/:id
// router.get('/:id', function(req, res) {
//   res.json({ id: req.params.id });
// });  

module.exports = router;