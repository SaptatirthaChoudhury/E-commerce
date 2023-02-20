/**
 * This file will contain the schema for the products
 * 
 * 
 * Product : 
 * 
 * id
 * name
 * description
 * cost
 * 
 * I need to define the schema and then export it to the external files
 */



module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allownull: false
        },
        description: {
            type: Sequelize.STRING
        },
        cost: {
            type: Sequelize.STRING,
            allownull: false
        }
    });

    return Product;
}