/**
 * This file will contain the schema definition for
 * the Category resource
 * 
 * we would export this schema to be called from other module
 */
module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("category", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            

        },
        name: {
            type: Sequelize.STRING,
            allownull: false,


        },
        description: {
            type: Sequelize.STRING

        },

    }, {

        tableName: "categories"

    })
    return Category;
};