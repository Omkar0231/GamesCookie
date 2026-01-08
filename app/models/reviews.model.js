module.exports = (sequelize, Sequelize) => {
  const Reviews = sequelize.define("game_review", {
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
    rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    helpfulCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    status: {
      type: Sequelize.BOOLEAN
    }
  });

  return Reviews;
};