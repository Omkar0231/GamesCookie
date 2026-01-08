module.exports = (sequelize, Sequelize) => {
  const Heroslider = sequelize.define("heroslider", {
    title: {
      type: Sequelize.STRING,
    },
    icon: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    url: {
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

  return Heroslider;
};