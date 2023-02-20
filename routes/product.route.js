/**
 * This file will contain the REST URIs mapping with the controllers 
 */

const productController = require("../controllers/product.controller");
const { requestValidator, authjwt, checkDuplicateProduct } = require("../middlewares");



module.exports = (app) => {

    //Route for creating a new product
    app.post("/ecomm/api/v1/products", [authjwt.verifyToken, authjwt.isAdmin, requestValidator.validateProductRequest, checkDuplicateProduct.checkDuplicateProduct], productController.create);

    // Route for getting the list of all the products
    app.get("/ecomm/api/v1/products", productController.findAll);

    //Route for getting the list of the product based on id
    app.get("/ecomm/api/v1/products/:id", productController.findOne);

    // Route for updating the list of the product based on id
    app.put("/ecomm/api/v1/products/:id", [authjwt.verifyToken, authjwt.isAdmin, requestValidator.validateProductRequest], productController.update);

    //Route for deleting the product based on id
    app.delete("/ecomm/api/v1/products/:id", [authjwt.verifyToken, authjwt.isAdmin], productController.delete);

}