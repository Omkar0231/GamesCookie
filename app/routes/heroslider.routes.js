
var router = require('express').Router();
const heroslider = require("../controllers/heroslider.controller.js");
const validator = require("../validation/validator.js");
const HerosliderSchema = require("../validation/heroslider.schema.js");
const middleware = require("../config/middleware.js");

var cache = require('./apicache');
// const cache = apicache.middleware;

    // Create a new
    router.post("/", middleware.verifyAdminToken, validator(HerosliderSchema.create), heroslider.create);

    // Retrieve all
    router.get("/", middleware.verifyAdminToken, heroslider.findAll);

    // Retrieve all 
    // router.get("/front", cache("1 day"), heroslider.findAllActive);
    router.get("/front", heroslider.findAllActive);

    // Update with id
    router.put("/:id", middleware.verifyAdminToken, validator(HerosliderSchema.update), heroslider.update);

    // Delete with id
    router.delete("/:id", middleware.verifyAdminToken, heroslider.delete);



module.exports = router;