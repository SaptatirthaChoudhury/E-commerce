
const jwt = require("jsonwebtoken");
const config = require("../configs/secret.config");

const db = require("../models");
const User = db.user;


/**
 * Logic to validate the access token
 */
verifyToken = (req, res, next) => {

    //Read the token from the header
    var token = req.headers['x-access-token'] // provided by the client

    if (!token) {
        return res.status(403).send({
            message: "No token provided"
        });

    }

    //Check the validity of the token
    jwt.verify(token, config.secret, (err, decodedToken) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized"
            })

        }

        req.userId = decodedToken.id; // Reading the user from the token and setting it in req object

        next();

    })

}

isAdmin = (req, res, next) => {
    // In the previous middleware we got the userId

    //Using that userId I will fetch the user object from db and check the user type

    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name == 'admin') {
                    next();
                    return;
                }

            }

            res.status(403).send({
                message: "Required ADMIN role"
            });
            return;

        })
    })
}

const authjwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
}

module.exports = authjwt;