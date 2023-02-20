/**
 * This file will expose the functionalities of all the model files defined under the models directory
 */

// Create the connection with the db

const Sequelize = require("sequelize");
const config = require("../configs/db.config");


/**
 * creating the db connection
 */

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        pool:
        {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

/**
 * I need to expose the sequelize and category model
 */

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
const categorySchema = require("./category.model");
db.category = categorySchema(sequelize, Sequelize);
const productSchema = require("./product.model");
db.product = productSchema(sequelize, Sequelize);
const User = require("./user.model");
db.user = User(sequelize, Sequelize);
const Role = require("./role.model");
db.role = Role(sequelize, Sequelize);
const Cart = require("./cart.model");
db.cart = Cart(sequelize, Sequelize);

/**
 * Establish the relation between
 * 1. category and product : One to Many
 */
db.category.hasMany(db.product);


/**
 * Establish the relation between
 * 1.user and role : Many to Many relation
 */
db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "role_id",
    otherKey: "user_id"
});

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "user_id",
    otherKey: "role_id"
});



/**
 * Establish the relation between
 * 1. user and cart : One to Many relation
 * 2. cart and the product : Many to Many relation
 */
db.user.hasMany(db.cart);

db.product.belongsToMany(db.cart, {
    through: "cart_products",
    foreignKey: "productId",
    otherKey: "cartId"
});

db.cart.belongsToMany(db.product, {
    through: "cart_products",
    foreignKey: "cartId",
    otherKey: "productid"
})

module.exports = db; // Export db object // 