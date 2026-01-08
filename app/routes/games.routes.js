
var router = require('express').Router();
const games = require("../controllers/games.controller.js");
const validator = require("../validation/validator.js");
const GamesSchema = require("../validation/games.schema.js");
const middleware = require("../config/middleware.js");

var cache = require('./apicache');
// const cache = apicache.middleware;

    //...
    // router.get("/front", cache("1 day"), middleware.getUserId, games.findAllActive);
    router.get("/front", middleware.getUserId, games.findAllActive);

    //...
    router.get("/", middleware.getUserId, games.findAll);
    router.get("/one/:id", middleware.getUserId, games.findOne);
    
    router.post("/", middleware.verifyAdminToken, validator(GamesSchema.create), games.create);
    router.put("/:id", middleware.verifyAdminToken, validator(GamesSchema.update), games.update);
    router.delete("/:id", middleware.verifyAdminToken, games.delete);

module.exports = router;