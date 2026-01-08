const { Sequelize, Op } = require('sequelize');
const db = require("../models/index.js");
const Games = db.Games;
const Categories = db.Categories;


// const sequelize = db.sequelize;


const slugify = (str) => {
  str = str.toLowerCase(); // Convert to lowercase
  str = str.trim(); // Remove leading/trailing whitespace

  // Replace various non-alphanumeric characters with hyphens
  str = str.replace(/[^a-z0-9 -]/g, ''); 

  // Replace multiple spaces or underscores with a single hyphen
  str = str.replace(/[\s_-]+/g, '-'); 

  // Remove leading and trailing hyphens
  str = str.replace(/^-+|-+$/g, ''); 

  return str;
}


// Retrieve all active.
exports.findAllActive = async (req, res) => {
    const specificUserId = req.userId;
  
    Games.findAll({
      where: { status: '1' },
      // attributes: ['id', 'title', 'image'],
      include: Categories,
      // attributes: {
      //     include: [
      //       [
      //         db.sequelize.literal(`(
      //           SELECT COUNT(*) > 0
      //           FROM favorites
      //           WHERE favorites.gameId = games.id
      //           AND favorites.userId = ${db.sequelize.escape(specificUserId)}
      //         )`),
      //         'isFavourite'
      //       ]
      //     ]
      //   }
    })
    .then(data => {
      if (data) {
        return res.status(200).json({
          message: "All Games",
          data: data
        });
      }
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });
};

// Retrieve all
exports.findAll = async (req, res) => {
    const specificUserId = req.userId;
    const { page = 1, limit = 10, status = 'All', search='' } = req.query; // Default to page 1, size 10
    const offset = (parseInt(page) - 1) * limit;
    const whereGameConditions = {};

    // Condition on the associated Categories model
    if (status != 'All') {
      whereGameConditions.status = status;
    }

    if (search) {
      
      // Search in game title
      whereGameConditions.title = {
        [Op.like]: `%${search}%`
      };
    
    }

    

    const data = await Games.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'ASC']
        ],
        where: whereGameConditions,
        // include: Categories,
        include: [{
          model: Categories,
          // where: whereIncludeConditions
        }],
        // attributes: {
        //   include: [
        //     [
        //       db.sequelize.literal(`(
        //         SELECT COUNT(*) > 0
        //         FROM favorites
        //         WHERE favorites.gameId = games.id
        //         AND favorites.userId = ${db.sequelize.escape(specificUserId)}
        //       )`),
        //       'isFavourite'
        //     ]
        //   ]
        // }
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / limit);

    return res.status(200).json({
        message: "All Games!",
        content: data.rows,
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalItems: data.count,
        limit: limit,
    });

};


// Create and Save
exports.create = (req, res) => {

  // Create a Game
  const gameData = {
    title: req.body.title,
    slug: slugify(req.body.title),
    image: req.body.image,
    categoryId: req.body.categoryId,
    game_url: req.body.game_url,
    description: req.body.description,
    meta_title: req.body.meta_title ?? '',
    meta_keywords: req.body.meta_keywords ?? '',
    meta_description: req.body.meta_description ?? '',
    status: req.body.status ? req.body.status : false
  };

  // Save Game in the database
  Games.create(gameData)
    .then(data => {
      return res.status(200).json({
        message: "Game created successfully.",
        // data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Game."
      });
    });
};

// Update
exports.update = (req, res) => {
  const id = req.params.id;
  let data = req.body;
  data.slug = slugify(req.body.title);

  Games.update(data, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Game was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Game with id=${id}. Maybe Game was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Game with id=" + id
      });
    });
};

// Single
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const specificUserId = req.userId;

  const gameData = await Games.findByPk(id, {
    where: { status: '1' },
    include: Categories,
    attributes: {
      include: [
        [
          db.sequelize.literal(`(
            SELECT COUNT(*) > 0
            FROM favorites
            WHERE favorites.gameId = games.id
            AND favorites.userId = ${db.sequelize.escape(specificUserId)}
          )`),
          'isFavourite'
        ]
      ]
    }
  });

  if (gameData) {

    //...related Games
    const relatedGames = await Games.findAll({
      limit: 4,
      where: { 
        status: '1', 
        categoryId: gameData.categoryId,
        id: {
          [Op.not]: id
        }
      },
      order: [
        Sequelize.fn('RAND')
      ],
      include: Categories,
    });


    
    return res.status(200).json({
        message: "Game Retrived!",
        data: gameData,
        relatedGames: relatedGames
    });
  
  } else {
    res.send({
      message: `Cannot find Game with id=${id}. Maybe Game was not found or req.body is empty!`
    });
  }
  
  


  // Games.findByPk(id, {
  //   where: { status: '1' },
  //   include: Categories,
  // })
  //   .then(data => {
  //     if (data) {

  //       return res.status(200).json({
  //         message: "Game Retrived!",
  //         data: data
  //       });
      
  //     } else {
  //       res.send({
  //         message: `Cannot find Game with id=${id}. Maybe Game was not found or req.body is empty!`
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     return res.status(500).json({ error: err.message });
  //   });
};




// Delete
exports.delete = (req, res) => {
  const id = req.params.id;
  
  Games.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Game was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Game with id=${id}. Maybe Game was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Game with id=" + id
      });
    });
};