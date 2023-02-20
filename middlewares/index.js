const requestValidator = require("./requestValidator");
const verifySignUp = require("./verifySignUp");
const authjwt = require("./authjwt");
const checkDuplicateProduct = require("./checkDuplicateProduct")

/**
 * This is returning object
 */
module.exports = {
    requestValidator,
    verifySignUp,
    authjwt,
    checkDuplicateProduct
}