
const db = require("../models/index.js");
const Categories = db.Categories;


// Create and Save a new Tutorial
exports.create = (req, res) => {

  // Create a Category
  const categoryData = {
    title: req.body.title,
    icon: req.body.icon,
    // image: req.body.image,
    status: req.body.status ? req.body.status : false
  };

  // Save Category in the database
  Categories.create(categoryData)
    .then(data => {
      return res.status(200).json({
        message: "Category created successfully.",
        // data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Category."
      });
    });
};


// Retrieve all Category from the database.
exports.findAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, size 10
    const offset = (parseInt(page) - 1) * limit;

    const data = await Categories.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'ASC']
        ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / limit);

    return res.status(200).json({
        message: "All Categories!",
        content: data.rows,
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalItems: data.count,
        limit: limit,
    });

};


// Retrieve all Category from the database.
exports.findAllActive = async (req, res) => {

    Categories.findAll({
      where: { status: '1' },
      attributes: ['id', 'title', 'icon']
    })
    .then(data => {
      if (data) {
        return res.status(200).json({
          message: "All Categories",
          data: data
        });

      }
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });

};


// Update a Category by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Categories.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Category was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Category with id=" + id
      });
    });
};

// Delete a Category with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Categories.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Category was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Category with id=" + id
      });
    });
};
