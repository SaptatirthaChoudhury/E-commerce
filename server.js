const bodyParser = require("body-parser");
const express = require("express");
const serverConfig = require("./configs/server.config");

const app = express();

// Registration body-parser middleware
app.use(bodyParser.json());


/**
 * Code for the table initialization
 */
const db = require("./models");

const Category = db.category;

const Role = db.role;




/**
 * Execute the create table operation
 */
db.sequelize.sync({ force: true }).then(() => {
    console.log("Table created");
    init();
}).catch(err => {
    console.log("error message : " + err);
})


/**
 * This function should be executed at the begining of the app start
 */
function init() {

    /**
     * create some initial categories
     * Bulk insert in Sequelize
     */

    var categories = [
        {
            name: "Desktop Computer",
            description: "This category will contain all Desktop Computer products"
        },
        {
            name: "Mens Wear",
            description: "This category will contain all the mens wear products"
        },
        {
            name: "Kitchen Kit",
            description: "This category will contain all the Kitechen related products"
        }
    ];

    Category.bulkCreate(categories).then(() => {

        console.log("categories are added");
    }).catch(err => {
        console.log("Error in initializing the categories", err.message);
    })

    /**
     * Create the roles
     */
    Role.create({
        id: 1,
        name: "customer"
    });

    Role.create({
        id: 2,
        name: "admin"
    })
}


//Initialization the routes 
const categoryRoute = require("./routes/category.route");
categoryRoute(app);

const productRoute = require("./routes/product.route");
productRoute(app);

const authRoute = require("./routes/auth.route");
authRoute(app);

const cartRoute = require("./routes/cart.route");
cartRoute(app);
app.listen(serverConfig.PORT, () => {
    console.log(`App is running on port : ${serverConfig.PORT}`);
})    