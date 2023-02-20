/**
 *  This file will be responsible for routing the requests to the correct controller method
 */
const controller = require("../controllers/category.controller");
const { requestValidator, authjwt } = require("../middlewares");


/**
 * 
 * const requestValidator = require("../middlewares");
 * 
 * Here above requestValidator represents the whole object 
 * 
 * {requestValidator} = require("../middlewares");
 * 
 * Here above {requestValidator} is representing  the key of the object
 */


module.exports = function (app) {



    // Route for creating a new category
    app.post("/ecomm/api/v1/categories", [authjwt.verifyToken, authjwt.isAdmin, requestValidator.validateCategoryRequest], controller.create);

    //Route for updating the category
    app.put("/ecomm/api/v1/categories/:id", [authjwt.verifyToken, authjwt.isAdmin, requestValidator.validateCategoryRequest], controller.update);

    //Route for getting all the categories
    app.get("/ecomm/api/v1/categories", controller.findAll);

    //Route for geting the category against the given id
    app.get("/ecomm/api/v1/categories/:id", controller.findOne);

    //Route for deleting the category against the given id
    app.delete("/ecomm/api/v1/categories/:id", [authjwt.verifyToken, authjwt.isAdmin], controller.delete);


}