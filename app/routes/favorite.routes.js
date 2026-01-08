
var router = require('express').Router();
const favorite = require("../controllers/favorite.controller.js");
const validator = require("../validation/validator.js");
const FavoriteSchema = require("../validation/favorite.schema.js");
const middleware = require("../config/middleware.js");


    // Create new
    router.post("/", middleware.verifyToken, validator(FavoriteSchema.create), favorite.create);

    // Retrieve all
    router.get("/", middleware.verifyToken, favorite.findAll);

    // my favorite
    router.get("/my", middleware.verifyToken, favorite.myFavorite);
    router.get("/front", middleware.getUserId, favorite.myFavoriteFront);

module.exports = router;