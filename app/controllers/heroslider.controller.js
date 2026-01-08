
const db = require("../models/index.js");
const Heroslider = db.Heroslider;


// Create and Save a new slider
exports.create = (req, res) => {

  // Create a slider
  const heroSliderData = {
    title: req.body.title,
    icon: req.body.icon,
    description: req.body.description,
    url: req.body.url,
    image: req.body.image,
    status: req.body.status ? req.body.status : false
  };

  // Save slider in the database
  Heroslider.create(heroSliderData)
    .then(data => {
      return res.status(200).json({
        message: "Slider created successfully.",
        // data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the slider."
      });
    });
};



// Retrieve all from the database.
exports.findAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, size 10
    const offset = (parseInt(page) - 1) * limit;

    const data = await Heroslider.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'ASC']
        ],
    });

    // Calculate total pages
    const totalPages = Math.ceil(data.count / limit);

    return res.status(200).json({
        message: "All all sliders!",
        content: data.rows,
        totalPages: totalPages,
        currentPage: parseInt(page),
        totalItems: data.count,
        limit: limit,
    });

};


// Retrieve all active from the database.
exports.findAllActive = async (req, res) => {

    Heroslider.findAll({
      where: { status: '1' }
    })
    .then(data => {
      if (data) {
        return res.status(200).json({
          message: "All Sliders",
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

  Heroslider.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Slider was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Slider with id=${id}. Maybe Slider was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Slider with id=" + id
      });
    });
};

// Delete a Slider with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Heroslider.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Slider was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Slider with id=${id}. Maybe Slider was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Slider with id=" + id
      });
    });
};
