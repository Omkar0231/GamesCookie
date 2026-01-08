
var router = require('express').Router();
const middleware = require("../config/middleware.js");
const dashboard = require("../controllers/dashboard.controller.js");


    // count All
    router.get("/countAll", middleware.verifyAdminToken, dashboard.countAll);



module.exports = router;