module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define("categories", {
    title: {
      type: Sequelize.STRING,
    },
    icon: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.BOOLEAN
    }
  });

  return Categories;
};