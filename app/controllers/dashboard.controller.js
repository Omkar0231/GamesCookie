
const db = require("../models/index.js");
const Games = db.Games;
const Heroslider = db.Heroslider;
const Hometrending = db.Hometrending;
const Users = db.Users;

//countAll
exports.countAll = async (req, res) => {

    const gamesCount = await Games.count({
        where: { status: '1' }
    });

    const herosliderCount = await Heroslider.count({
        where: { status: '1' }
    });

    const hometrendingCount = await Hometrending.count({
        where: { status: '1' }
    });

    const usersCount = await Users.count({
        // where: { status: '1' }
    });




    return res.status(200).json({
        message: "Dashboard Count All",
        gamesCount: gamesCount,
        herosliderCount: herosliderCount,
        hometrendingCount: hometrendingCount,
        usersCount: usersCount,
    });

};