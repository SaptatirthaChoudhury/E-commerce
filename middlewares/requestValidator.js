/**
 * This file will consists of middlewares for validating the request body
 */

const { category, product } = require("../models");


/**
 * Validate the request body for categories
*/

const validateCategoryRequest = (req, res, next) => {

    if (!req.body.name) {                       // Check for name
        res.status(400).send({
            message: "Name of the category is not provided"
        })
    } else if (!req.body.description) {        // check for description
        res.status(400).send({
            message: "Description of the category is not provided"
        })
    } else {
        next();                               // if name and description are given correctly then go to the next controller
    }
}

/**
 * Validator for the Products request body
 */
const validateProductRequest = (req, res, next) => {
    if (!req.body.name) {                                  // Check for name
        res.status(400).send({
            message: "Name of the product is not provided"
        })
    } else if (!req.body.description) {                  // check for description
        res.status(400).send({
            message: "Description of the product is not provided"
        })
    } else if (req.body.cost == null) {               // check for cost
        res.status(400).send({
            message: "Cost of the product is not provided"
        })
    } else if (req.body.categoryId) {
        category.findByPk(req.body.categoryId).then(category => {
            if (!category) {
                res.status(400).send({
                    message: "Category Id is  not valid ! "
                });

            } else {
                next();
            }

        });

    } else if (!req.body.categoryId) {
        res.status(400).send({
            message: "Category Id is  not provided ! "
        })
    } else {
        next();                                    // if name and description are given correctly then go to the next controller
    }
}


module.exports = {
    validateCategoryRequest: validateCategoryRequest,
    validateProductRequest: validateProductRequest
}


