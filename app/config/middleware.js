const jsonwebtoken = require('jsonwebtoken');

const db = require("../models");
const Users = db.Users;


//  Verify Token
exports.verifyToken = async (req, res, next) => {

    const access_token = req.headers.authorization.split(' ')[1];

    await jsonwebtoken.verify(access_token, process.env.JWT_SECRET, (err, decoded) => {
// console.log('___________________', decoded)
        if (err) return res.sendStatus(403); // Forbidden
        //...    
        const userId = decoded.userId;

        //check token in users table
        Users.findByPk(userId)
            .then(data => {
            if (data) {
                if(data.token == access_token){
                    req.userId = userId;
                    next();
                } else {
                    return res.status(401).json({ error: "Invalid credentials" });
                }
            } else {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            })
            .catch(err => {
                return res.status(500).json({ error: err.message });
            });

    });

}


//  Verify Admin Token
exports.verifyAdminToken = async (req, res, next) => {

    const access_token = req.headers.authorization.split(' ')[1];

    await jsonwebtoken.verify(access_token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) return res.sendStatus(403); // Forbidden
        //...    
        const userId = decoded.userId;

        //check token in users table
        Users.findByPk(userId)
            .then(data => {
            if (data) {
                if(data.token == access_token && data.role == 'admin'){
                    req.userId = userId;
                    next();
                } else {
                    return res.status(401).json({ error: "Invalid credentials" });
                }
            } else {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            })
            .catch(err => {
                return res.status(500).json({ error: err.message });
            });

    });

}



//  UserId
exports.getUserId = async (req, res, next) => {

    if(req.headers?.authorization){
        const access_token = req.headers.authorization.split(' ')[1];

        await jsonwebtoken.verify(access_token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) return res.sendStatus(403); // Forbidden
            //...    
            const userId = decoded.userId;

            req.userId = userId;
            next();

        });
    }
    else {
        req.userId = null;
        next();
    }

}