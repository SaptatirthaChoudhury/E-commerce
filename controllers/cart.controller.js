


const db = require("../models");

const Cart = db.cart;
const Product = db.product;


/**
 * Handler for creating the cart request
 */
exports.create = (req, res) => {
    const cart = {
        userId: req.userId
    }


    Cart.create(cart).then(cart => {
        res.status(200).send(cart)
    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message: "Some internal error happened"
        })
    })
}




/**
 * Handler for updating the cart
 */

exports.update = (req, res) => {

    // Figure out of the cart is present, which needs to be updated
    const cartId = req.params.id;

    Cart.findByPk(cartId).then(cart => {

        //Add the products passed in the request body to the cart

        var productsIds = req.body.productsIds;

        Product.findAll({
            where: {
                id: productsIds
            }
        }).then(products => {

            if (!products) {
                res.status(400).send({
                    message: "Products trying to add doesn't exist ! "
                });
                return;
            }
            // Set these products inside the Cart
            cart.setProducts(products).then(() => {

                console.log("Products successfully added to the cart");

                //Take care of cost part
                var totalCost = 0;
                var productsSelected = [];
                cart.getProducts().then(cartProducts => {

                    for (i = 0; i < cartProducts.length; i++) {

                       // console.log("cartProductid : " + cartProducts[i].id, "cartProductname : " + cartProducts[i].name, "cartProductcost : " + cartProducts[i].cost);

                        productsSelected.push({
                            id: cartProducts[i].id,
                            name: cartProducts[i].name,
                            cost: cartProducts[i].cost
                        });
                        totalCost = totalCost + parseInt(cartProducts[i].cost);
                    }
                    // Update cart table of column cost 
                    Cart.update(
                        {
                            cost: totalCost

                        },
                        {
                            where: {
                                id: cart.id
                            }
                        }).then((updatedCart) => {
                            console.log("Successfully updated cart table of column cost ! " + updatedCart);
                            // I am ready to return the cart update response
                        }).catch(err => {
                            console.log("Failed to update cart table of column cost ! " + err);
                        })


                    res.status(200).send({
                        id: cart.id,
                        productsSelected: productsSelected,
                        cost: totalCost
                    })

                }).catch(err => {
                    console.log("error occured due to cart get the products ! " + err);
                })
            }).catch(err => {
                console.log("error occured due to cart set the products ! " + err);
            })
        }).catch(err => {
            console.log("error occured due to finding the products against the request params ! " + err);
        })
    })
}



/**
 * Search for a cart based on the cart id
 */
exports.searchById = (req, res) => {
    const cartId = req.params.id;

    Cart.findByPk(cartId).then(cart => {

        //Take care of cost part
        var cost = 0;
        var productsSelected = [];
        cart.getProducts().then(cartProducts => {
            for (i = 0; i < cartProducts.length; i++) {

                productsSelected.push({
                    id: cartProducts[i].id,
                    name: cartProducts[i].name,
                    cost: cartProducts[i].cost
                });
                cost = cost + parseInt(cartProducts[i].cost);
            }

            // I am ready to return the cart update response

            res.status(200).send({
                id: cart.id,
                productsSelected: productsSelected,
                cost: cost
            })
        }).catch(err => {
            console.log(err);
            res.status(400).send({
                message: "error ocuured due to cart get the products ! " + err
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(402).send({
            message: "error occured due to get the cart against the id " + err
        })
    })

}