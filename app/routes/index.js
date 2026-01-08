var router = require('express').Router();
const middleware = require("../config/middleware.js");
var apicache = require('apicache');

// split up route handling

////authentication
router.use('/auth', require('./authenticate.routes.js'));

////profile
router.use('/user', require('./users.routes.js'));

////categories
router.use('/categories', require('./categories.routes.js'));

////games
router.use('/games', require('./games.routes.js'));

////heroslider
router.use('/heroslider', require('./heroslider.routes.js'));

////hometrending
router.use('/hometrending', require('./hometrending.routes.js'));

////favorite
router.use('/favorite', require('./favorite.routes.js'));

////reviews
router.use('/reviews', require('./reviews.routes.js'));

////partner
router.use('/partner', require('./partner.routes.js'));

////metatags
router.use('/metatags', require('./metatags.routes.js'));



////dashboard
router.use('/dashboard', require('./dashboard.routes.js'));




//...
router.get("/cache-clear", (req, res) => {
  apicache.clear();

  return res.status(200).json({
      message: "Cache has been cleared.",
    });
});

module.exports = router;