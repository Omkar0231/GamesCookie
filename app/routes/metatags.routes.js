
var router = require('express').Router();
const metatags = require("../controllers/metatags.controller.js");
const validator = require("../validation/validator.js");
const MetatagsSchema = require("../validation/metatags.schema.js");
const middleware = require("../config/middleware.js");

var cache = require('./apicache');
// const cache = apicache.middleware;

    // Create a new
    router.post("/", middleware.verifyAdminToken, validator(MetatagsSchema.create), metatags.create);

    // Retrieve all
    router.get("/", middleware.verifyAdminToken, metatags.findAll);

    // Retrieve all 
    // router.get("/front", cache("1 day"), metatags.findAllActive);
    router.get("/front", metatags.findAllActive);

    // Update with id
    router.put("/:id", middleware.verifyAdminToken, validator(MetatagsSchema.update), metatags.update);

    // Delete with id
    router.delete("/:id", middleware.verifyAdminToken, metatags.delete);



module.exports = router;