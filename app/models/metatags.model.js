module.exports = (sequelize, Sequelize) => {
  const Metatags = sequelize.define("metatags", {
    title: {
      type: Sequelize.STRING,
    },
    keyword: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }
  });

  return Metatags;
};