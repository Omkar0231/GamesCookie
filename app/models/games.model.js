module.exports = (sequelize, Sequelize) => {
  const Games = sequelize.define("games", {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    categoryId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'categories',
            key: 'id',
        },
    },
    game_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    meta_title: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    meta_keywords: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    meta_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.BOOLEAN
    }
  });


  return Games;
};

