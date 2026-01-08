
const db = require("../models/index.js");
const Favorite = db.Favorite;
const Games = db.Games;
const Categories = db.Categories;


// Create and Save
exports.create = async (req, res) => {

  // Create new
  const favoriteData = {
    userId: req.userId,
    gameId: req.body.gameId,
  };

  const checkFav = await Favorite.findOne({ where: favoriteData });

    if (checkFav) {
        checkFav.destroy();

        return res.status(200).json({
            message: "Favorite removed successfully.",
            favorite: false
        });
    }


  // Save in the database
  Favorite.create(favoriteData)
    .then(data => {
      return res.status(200).json({
        message: "Favorite added successfully.",
        favorite: true
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Favorite."
      });
    });
};


// Retrieve all
exports.findAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, size 10
    const offset = (parseInt(page) - 1) * limit;

    const data = await Favorite.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'ASC']
        ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / limit);

    return res.status(200).json({
        message: "All favorite!",
        content: data.rows,
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalItems: data.count,
        limit: limit,
    });

};


// my Favorite
exports.myFavorite = async (req, res) => {
    const specificUserId = req.userId;

    const myFav = await Favorite.findAll({
      where: { userId: specificUserId },
      include: [{
          model: Games,
          include: Categories,
        }],
    });

    return res.status(200).json({
        message: "Favorite Games!",
        data: myFav,
    });
};

exports.myFavoriteFront = async (req, res) => {
    const specificUserId = req.userId;

    const myFav = await Favorite.findAll({
      where: { userId: specificUserId },
      attributes: ['gameId'],
      raw: true
    });

    const idArray = myFav.map(fav => fav.gameId);

    return res.status(200).json({
        message: "Favorite Games!",
        data: idArray,
    });
};



