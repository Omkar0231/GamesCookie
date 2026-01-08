
var router = require('express').Router();
const hometrending = require("../controllers/hometrending.controller.js");
const validator = require("../validation/validator.js");
const HometrendingSchema = require("../validation/hometrending.schema.js");
const middleware = require("../config/middleware.js");

var cache = require('./apicache');
// const cache = apicache.middleware;

    // Create a new
    router.post("/", middleware.verifyAdminToken, validator(HometrendingSchema.create), hometrending.create);

    // Retrieve all
    router.get("/", middleware.verifyAdminToken, hometrending.findAll);

    // Retrieve all 
    // router.get("/front", cache("1 day"), middleware.getUserId, hometrending.findAllActive);
    router.get("/front", middleware.getUserId, hometrending.findAllActive);

    // Update with id
    router.put("/:id", middleware.verifyAdminToken, validator(HometrendingSchema.update), hometrending.update);

    // Delete with id
    router.delete("/:id", middleware.verifyAdminToken, hometrending.delete);



module.exports = router;