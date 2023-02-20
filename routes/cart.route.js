

const { authjwt } = require("../middlewares");
const cartController = require("../controllers/cart.controller");

module.exports = (app) => {
    //Route for creating the cart
    app.post("/ecomm/api/v1/carts", [authjwt.verifyToken], cartController.create)

    //Route for getting the cart
    app.get("/ecomm/api/v1/carts/:id", [authjwt.verifyToken], cartController.searchById)

    //Route for update the cart
    app.put("/ecomm/api/v1/carts/:id", [authjwt.verifyToken], [cartController.update]);
}