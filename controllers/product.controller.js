/**
 * This is the controller class for the Product resource
 */

/**
 * Handler for creating product
 */

const db = require("../models");
const Product = db.product;

exports.create = (req, res) => {
    /**
     * Get the req body
     */
    const product = {
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        categoryId: req.body.categoryId
    }

    /**
     * Store this product in DB
     */
    Product.create(product).then(product => {
        console.log("Product added in the database ", product.name);
        res.status(200).send(product);
    }).catch(err => {
        console.log("Error while adding the product with name ", product.name);
        res.status(500).send({
            message: "Some internal error happened !"
        });

    });

    return product;
}

/**
 * Handler for get all products
 */
exports.findAll = (req, res) => {

    const productName = req.query.name;

    let promise;
    if (productName) {
        promise = Product.findAll({
            where: {
                name: productName
            }
        });
    } else {
        promise = Product.findAll();
    }


    promise.then(products => {
        res.status(200).send(products);
    }).catch(() => {
        res.status(500).send({
            message: "Some internal error occured"
        });
    });
}

/**
 * Handler for get products based on product id
 */
exports.findOne = (req, res) => {
    const productId = req.params.id;

    Product.findByPk(productId).then(product => {
        res.status(201).send(product);
    }).catch(err => {
        res.status(500).send({
            message: `Some internal error happened during quering by findByPk ! ${err}`
        });
    });
}


/**
 * Handler for updating the product
 */
exports.update = (req, res) => {
    /**
     * I need to parse the request body, just like POST
     */
    const product = {
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        categoryId: req.body.categoryId
    }

    /**
     * I need to know which Product has to be updated
     */
    const productId = req.params.id;

    /**
     * It's time to update the product
     */
    Product.update(product, {
        where: {
            id: productId
        },
        returning: true
    }).then(() => {
        /**
         * I need to return the updated product
         */

        Product.findByPk(productId).then(productRes => {
            res.status(201).send(productRes);
        }).catch(err => {
            res.status(500).send({
                message: "Some internal error happened during find by primary key quering" + err
            });
        });

    }).catch(err => {
        res.status(500).send({
            message: "Some internal error happened in the then block !" + err
        });
    });

    return product;

}

/**
 * Handler for deleting the product
 */
exports.delete = (req, res) => {
    const productId = req.params.id;

    Product.destroy({
        where: {
            id: productId
        }
    }).then(() => {
        res.status(200).send({
            message: "Successfully deleted the field"
        })
    }).catch(err => {
        res.status(500).send({
            message: "Some internal error happened" + err
        });
    });
}