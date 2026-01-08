const dbConfig = require("../config/db.config.js");


const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//....
db.Users = require("./users.model.js")(sequelize, Sequelize);
db.Categories = require("./categories.model.js")(sequelize, Sequelize);
db.Games = require("./games.model.js")(sequelize, Sequelize);
db.Heroslider = require("./heroslider.model.js")(sequelize, Sequelize);
db.Hometrending = require("./hometrending.model.js")(sequelize, Sequelize);
db.Favorite = require("./favorite.model.js")(sequelize, Sequelize);
db.Reviews = require("./reviews.model.js")(sequelize, Sequelize);
db.Metatags = require("./metatags.model.js")(sequelize, Sequelize);



// Define associations
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

//....Relations
//...Games
db.Games.belongsTo(db.Categories, { foreignKey: 'categoryId' });

//...Hometrending
db.Hometrending.belongsTo(db.Games, { foreignKey: 'gameId' });

//...Favorite
db.Favorite.belongsTo(db.Users, { foreignKey: 'userId' });
db.Favorite.belongsTo(db.Games, { foreignKey: 'gameId' });

//...reviews
db.Reviews.belongsTo(db.Users, { foreignKey: 'userId' });


module.exports = db;