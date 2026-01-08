const { Sequelize, } = require('sequelize');
const db = require("../models/index.js");
const Reviews = db.Reviews;
const Users = db.Users;

const gameReviewsAvg = async (gameId) => {
  const stats = await Reviews.findOne({
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("rating")), "avgRating"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "totalReviews"]
    ],
    where: { gameId: gameId }
  });

  const average = parseFloat(stats.get("avgRating") || 0).toFixed(1);
  const totalReviews = parseInt(stats.get("totalReviews")) || 0;

  return {
    average,
    totalReviews
  };
}

// Create and Save a new
exports.create = (req, res) => {

  // Create
  const { gameId, rating, comment='' } = req.body;
  
  const data = {
    userId: req.userId,
    gameId: gameId,
    rating: rating,
    comment: comment,
    status: true
  };


  // Save
  Reviews.create(data)
    .then(data => {
      return res.status(200).json({
        message: "Review submitted successfully.",
        // data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Reviews."
      });
    });
};



// find by gameId
exports.findAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const gameId = req.params.gameId;

    

    const data = await Reviews.findAndCountAll({
        where: { gameId: gameId, status: '1' },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
          model: Users,
          attributes: ['name', 'initial', 'image']
        }],

        limit: limit,
        offset: offset
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / limit);
    const {average } = await gameReviewsAvg(gameId);

    return res.status(200).json({
        message: "All Reviews!",
        content: data.rows,
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalItems: data.count,
        average: average,
        limit: limit,
    });


};