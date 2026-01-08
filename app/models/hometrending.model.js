module.exports = (sequelize, Sequelize) => {
  const Hometrending = sequelize.define("hometrending", {
    gameId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'games',
            key: 'id',
        },
    },
    tag: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.BOOLEAN
    }
  });

  return Hometrending;
};