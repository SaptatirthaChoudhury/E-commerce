
const { mockRequest, mockResponse } = require("../interceptor");
const newProduct = require("../mockData/newProduct.json")
const updatedProduct = require("../mockData/updatedProduct.json");
const Product = require("../../../models").product

const productController = require("../../../controllers/product.controller");


/**
 * I need to test the functionality of creating Product
 */

/**
 * Before the testing is done, we need to have the req and res objects
 * 
 * Normally req and res, will be passed by route layer, but here since there is no routes, we need to create mock req and res
 * 
 * Mocked req and res is provided by interceptor.js file
 */

let req, res;

beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
})

describe("Testing create product method", () => {
    beforeEach(() => {
        {
            //For creating the product, req should have a body 
            req.body = newProduct

        }
    })

    it("test successfull creation of a new product", async () => {

        //Mock and spy Product create method
        const spy = jest.spyOn(Product, 'create').mockImplementation(() => Promise.resolve(newProduct));

        //Execute the create method
        await productController.create(req, res);

        //Validation

        //I will expect spy to be called
        await expect(spy).toHaveBeenCalled();

        //I will expect Product create method
        expect(Product.create).toHaveBeenCalledWith(newProduct);

        // res status should be set to 201

        expect(res.status).toHaveBeenCalledWith(200);
        console.log(res.status.mock.calls);

        //res send is sending the newProduct
        expect(res.send).toHaveBeenCalledWith(newProduct);
        console.log(res.send.mock.calls);
    });


    it("Test failure during the creation of a new product", async () => {
        //write some code to test the failure condition

        //Mock and spy
        const spy = jest.spyOn(Product, 'create').mockImplementation(() => Promise.reject(Error("Error while creating")));

        //Execute the method
        await productController.create(req, res);

        //Validation
        await expect(spy).toHaveBeenCalled();
        expect(Product.create).toHaveBeenCalledWith(newProduct);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error happened !"
        })

    })


})


describe("Testing the findAll method", () => {

    it("Testing the find all method when no any param was passed", async () => {

        //Mock the findAll method of the category controller
        const spy = jest.spyOn(Product, 'findAll').mockImplementation(() => Promise.resolve(newProduct));

        //Invoke the method
        await productController.findAll(req, res);

        //validation
        expect(spy).toHaveBeenCalled();
        expect(Product.findAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(newProduct);
    })

    it("Test the find all method when query param was passed", async () => {
        //Mock the findAll method where param was passed

        const query = {
            where: {
                name: "Galax graphics Card"
            }
        };

        const spy = jest.spyOn(Product, 'findAll').mockImplementation((query) => Promise.resolve(newProduct))

        req.query = {
            name: "Galax graphics Card"
        }

        //Execute the method
        await productController.findAll(req, res);

        //Validations
        expect(spy).toHaveBeenCalled();
        expect(Product.findAll).toHaveBeenCalledWith(query);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(newProduct)

    })
})

// describe("Testing the update method", () => {

//     it("Testing the update method with provided params", async () => {
//         //Mock the update method of the product controller

//         const spyOnUpdate = jest.spyOn(Product, 'update').mockImplementation(() => Promise.resolve(updatedProduct))

//         const spyOnFindByPk = jest.spyOn(Product, 'findByPk').mockImplementation(() => Promise.resolve(updatedProduct))

//         req.body = updatedProduct;
//         req.params = {
//             id: 1
//         }

//         //Execute
//         await productController.update(req, res);

//         //Validation
//         await expect(spyOnUpdate).toHaveBeenCalled();
//         await expect(spyOnFindByPk).toHaveBeenCalled();
//         expect(Product.update).toHaveBeenCalled();

//         expect(res.status).toHaveBeenCalledWith(201);
//         expect(res.send).toHaveBeenCalledWith(updatedProduct);


//     })
// })
//_____________________________use above describe method for testing update method or keep your eye on below lines.________________________________________________________//

describe("Testing the update method", () => {
    it("Testing with given parameters", async () => {
        // Spy on the `update` method of the `Product` model
        const spyOnUpdate = jest.spyOn(Product, 'update').mockImplementation(() => Promise.resolve([1]));

        // Spy on the `findByPk` method of the `Product` model
        const spyOnFindByPk = jest.spyOn(Product, 'findByPk').mockImplementation(() => Promise.resolve(updatedProduct));

        // Set the request parameters
        req.params = {
            id: 1
        };

        // Set the request body
        req.body = updatedProduct

        // Execute the method
        await productController.update(req, res);

        // Validate the results
        await expect(spyOnUpdate).toHaveBeenCalled();
        expect(Product.update).toHaveBeenCalledWith(req.body, {
            where: {
                id: req.params.id
            },
            returning: true
        });
        await expect(spyOnFindByPk).toHaveBeenCalled();
        expect(Product.findByPk).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(updatedProduct);
    });
});

describe("Testing the findOne method", () => {

    it("Testing with given param of findOne method", async () => {
        //Mock the findByPk method of Product model
        const spyOnFindByPk = jest.spyOn(Product, 'findByPk').mockImplementation(() => Promise.resolve(newProduct));

        //Set request params
        req.params = {
            id: 1
        }

        //Execute the findOne method
        await productController.findOne(req, res);

        //Validation
        //Expect findByPk method to have been called
        await expect(spyOnFindByPk).toHaveBeenCalled();
        //Expect findByPk method to have been called with the given product ID
        expect(Product.findByPk).toHaveBeenCalledWith(req.params.id);
        //Expect response status to have been set to 201
        expect(res.status).toHaveBeenCalledWith(201);
        //Expect response to have been sent with the mock product data
        expect(res.send).toHaveBeenCalledWith(newProduct);
    });
});


describe("Testing the delete method", () => {

    it("testing with param of delete method", async () => {
        //Mock the destroy method of product model
        const spyOndestroy = jest.spyOn(Product, 'destroy').mockImplementation(() => Promise.resolve(newProduct))

        //Set request params
        req.params = {
            id: 1
        }

        //Execute 
        await productController.delete(req, res);

        //Validation
        await expect(spyOndestroy).toHaveBeenCalled();
        expect(Product.destroy).toHaveBeenCalledWith({
            where: {
                id: req.params.id
            }

        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            message: "Successfully deleted the field"
        })
    })
})



