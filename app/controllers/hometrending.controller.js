
const db = require("../models/index.js");
const Hometrending = db.Hometrending;
const Games = db.Games;
const Categories = db.Categories;


// Create
exports.create = (req, res) => {

  // array
  const data = {
    gameId: req.body.gameId,
    tag: req.body.tag,
    status: req.body.status ? req.body.status : false
  };

  // Save in the database
  Hometrending.create(data)
    .then(data => {
      return res.status(200).json({
        message: "Trending created successfully.",
        // data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the trending."
      });
    });
};



// Retrieve all from the database.
exports.findAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, size 10
    const offset = (parseInt(page) - 1) * limit;

    const data = await Hometrending.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'ASC']
        ],
        include: Games,
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / limit);

    return res.status(200).json({
        message: "Data Retrived!",
        content: data.rows,
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalItems: data.count,
        limit: limit,
    });

};


// Retrieve all active from the database.
exports.findAllActive = async (req, res) => {
    const specificUserId = req.userId;

    Hometrending.findAll({
      where: { status: '1' },
      // include: Games,
      subQuery: false,

      include: [{
          model: Games,
          include: Categories,

        }],


      // attributes: {
      //   include: [
      //     [
      //       db.sequelize.literal(`(
      //         SELECT COUNT(*) > 0
      //         FROM favorites
      //         WHERE favorites.gameId = \`Games\`.id
      //         AND favorites.userId = ${db.sequelize.escape(specificUserId)}
      //       )`),
      //       'isFavourite'
      //     ]
      //   ]
      // }
      
    })
    .then(data => {
      if (data) {
        return res.status(200).json({
          message: "All trendings",
          data: data
        });

      }
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });

};


// Update
exports.update = (req, res) => {
  const id = req.params.id;

  Hometrending.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Trending was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Trending with id=${id}. Maybe Trending was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Trending with id=" + id
      });
    });
};

// Delete
exports.delete = (req, res) => {
  const id = req.params.id;

  Hometrending.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Trending was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Trending with id=${id}. Maybe Trending was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Trending with id=" + id
      });
    });
};
