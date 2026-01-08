var router = require('express').Router();
const partnerController = require("../controllers/partner.controller.js");

const validator = require("../validation/validator.js");
const PartnerSchema = require("../validation/partner.schema.js");
const middleware = require("../config/middleware.js");


    router.post("/html_games", validator(PartnerSchema.createHtmlGames), partnerController.createHtmlGames);

    router.post("/apply_job", validator(PartnerSchema.createApplyJob), partnerController.createApplyJob);





module.exports = router;