module.exports = (sequelize, Sequelize) => {
  const Favorite = sequelize.define("favorite", {
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    gameId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'games',
            key: 'id',
        },
    },
  });

  return Favorite;
};