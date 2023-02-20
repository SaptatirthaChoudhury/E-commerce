/**
 * This controller file will be used for authentication and authorization
 */
// For password encryption
const bcrypt = require('bcryptjs');



const db = require("../models");

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");

const secretKey = require("../configs/secret.config");

/**
 * Handler for signup
 */
exports.signup = (req, res) => {
    // Read the request body and create user object

    const userObj = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8) // need to encrypt this
    }

    //Persist this user object to the db 
    User.create(userObj).then(user => {
        console.log("user created");

        //I also need to provide correct roles to this
        if (req.body.roles) {
           
            // I need to first have the Roles created in the system

            // I need to check if the desired roles match with the supported roles

            Role.findAll({
                where: {
                    name: {
                        // where name = 1 or name = 2 or name = 3
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles => {
               
                //Set these roles with user
                user.setRoles(roles).then(() => {
                    console.log("registration completed by user set roles ");
                    res.status(201).send({
                        message: "User successfully registered"
                    })
                })

            }).catch(err => {
                console.log("Registration failed ! " + err);
                res.status(500).send({
                    message: "Some Internal error"
                })
            })
        } else {
            user.setRoles([1]).then(() => {
                console.log("registration completed");

                res.status(201).send({
                    message: "User successfully registered"
                })
            })
        }
    }).catch(err => {
        console.log("Error while creating user ", err.message);
        res.status(500).send({
            message: "Some Internal error"
        })
    })

}

/**
 * Handler for signin
 */

exports.signin = (req, res) => {
    //Check if the user exist

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        // console.log("user : ", user);
        if (!user) {
            res.status(404).send({
                message: "User not found ! "
            })
            return;
        }

        //verify the password
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            res.status(401).send({
                message: "Invalid Password ! "

            });
            return;
        }

        /**
         * Need to generate the access token 
         */
        var token = jwt.sign({ id: user.id }, secretKey.secret, {
            expiresIn: 300 // 
        });

        /**
         * I want to provide the roles assigned to user in the response
         */

        var authorities = [];
        user.getRoles().then(roles => {

            for (i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });

    }).catch(err => {
        res.status(500).send({
            message: "Internal error while signin ! " + err
        })
    })
}


//__________________________
// One option is that I fetch the Role object by running the query
            //______________________________________________________________________________
            // Role.findOne({
            //     where: {
            //         name: customer
            //     }
            // }).then(roles => {
            //     user.setRoles(roles).then(() => {
            //         console.log("registration completed");
            //         res.status(201).send({
            //             message: "User successfully registered"
            //         })
            //     })
            // }).catch(err => {
            //     console.log("Registration has failed ! ");
            //     res.status(500).send({
            //         message: "Error occured ! " + err
            //     })
            // })
            //_________________________________________________________________________________
