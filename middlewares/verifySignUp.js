/**
 * Validation for the duplicate email or username
 */

const db = require("../models");
const User = db.user;
const Role = db.role;


const Op = db.Sequelize.Op;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    //check for the username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(userName => {
        if (userName) {
            res.status(400).send({
                message: "Failed !, username already exists"

            });
            return;
        }

        //If user is not present then also validate for e-mail 

        //check for the email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(userEmail => {
            if (userEmail) {
                res.status(400).send({
                    message: "Failed !, email already exists"
                });
                return;
            }
            next();
        })

    })

}

checkForCorrectRoles = (req, res, next) => {

    Role.findAll({
        where: {
            name: {
                // where name = 1 or name = 2 or name = 3
                [Op.or]: req.body.roles
            }
        }
    }).then(roles => {
       console.log(roles);
        if (roles.length === 0) {
            res.status(400).send({
                message: "Role not found ! "
            });
            return;
        } else {
            console.log("role found .....");
            next();
        }
    })
}


const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkForCorrectRoles: checkForCorrectRoles
}

module.exports = verifySignUp;  