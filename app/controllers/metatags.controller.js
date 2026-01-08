
const db = require("../models/index.js");
const Metatags = db.Metatags;


// Create and Save a new Metatags
exports.create = async (req, res) => {

  // Create a Metatags
  const metatagsData = {
    title: req.body.title,
    keyword: req.body.keyword,
    description: req.body.description,
    type: req.body.type,
  };

  const typeCheck = await Metatags.findOne({ where: {type: req.body.type} });

    if (typeCheck) {
        return res.status(500).json({ message: "Type already exist" });
    }

  // Save Metatag in the database
  Metatags.create(metatagsData)
    .then(data => {
      return res.status(200).json({
        message: "Metatag created successfully.",
        // data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Metatag."
      });
    });
};



// Retrieve all from the database.
exports.findAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, size 10
    const offset = (parseInt(page) - 1) * limit;

    const data = await Metatags.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'DESC']
        ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / limit);

    return res.status(200).json({
        message: "All all Metatag!",
        content: data.rows,
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalItems: data.count,
        limit: limit,
    });

};


// Retrieve all active from the database.
exports.findAllActive = async (req, res) => {

    Metatags.findAll()
    .then(data => {
      if (data) {
        return res.status(200).json({
          message: "All Metatags",
          data: data
        });

      }
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });

};


// Update data id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Metatags.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Metatag was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Metatag with id=${id}. Maybe Metatag was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Metatag with id=" + id
      });
    });
};

// Delete a Metatag with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Metatags.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Metatag was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Metatag with id=${id}. Maybe Metatag was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Metatag with id=" + id
      });
    });
};
