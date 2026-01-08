
var router = require('express').Router();
const categories = require("../controllers/categories.controller.js");
const validator = require("../validation/validator.js");
const CategoriesSchema = require("../validation/categories.schema.js");
const middleware = require("../config/middleware.js");

var cache = require('./apicache');
// const cache = apicache.middleware;

    // Create a new Category
    router.post("/", middleware.verifyAdminToken, validator(CategoriesSchema.create), categories.create);

    // Retrieve all Categories
    router.get("/", middleware.verifyAdminToken, categories.findAll);

    // Retrieve all Categories
    // router.get("/front", cache("1 day"), categories.findAllActive);
    router.get("/front", categories.findAllActive);

    // Update a Category with id
    router.put("/:id", middleware.verifyAdminToken, validator(CategoriesSchema.update), categories.update);

    // Delete a Category with id
    router.delete("/:id", middleware.verifyAdminToken, categories.delete);



module.exports = router;