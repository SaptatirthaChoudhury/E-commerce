
const { mockRequest, mockResponse } = require("../interceptor");
const newCategory = require("../mockData/newCategory.json");
const updatedCategory = require("../mockData/updatedCategory.json");
const Category = require("../../../models").category;
const categoryController = require("../../../controllers/category.controller");
const { category } = require("../../../models");


/**
 * I need to test the functionality of creating Category
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

describe("Testing create category method", () => {

    beforeEach(() => {
        {
            //For creating the category, req should have a body 
            req.body = newCategory

        }
    })


    it("test successfull creation of a new category", async () => {

        //Mock and spy on Category create method
        const spy = jest.spyOn(Category, 'create').mockImplementation(() => Promise.resolve(newCategory));

        //Execute the create method

        await categoryController.create(req, res);

        //Validation 

        //I will expect spy to be called
        expect(spy).toHaveBeenCalled();

        //I will expect Category create method
        expect(Category.create).toHaveBeenCalledWith(newCategory);

        // res status should be set to 201
        expect(res.status).toHaveBeenCalledWith(201);

        // res send is sending the newCategory
        expect(res.send).toHaveBeenCalledWith(newCategory);


    });

    /**
     * Testing the failure scenario
     */
    it("test failure during the creation of a new category", async () => {

        //Write some code to test the failure condition

        //Mock and spy
        const spy = jest.spyOn(Category, 'create').mockImplementation(() => Promise.reject(Error("Error while creating")))

        //Execute the method
        await categoryController.create(req, res);

        //validation 
        await expect(spy).toHaveBeenCalled();
        expect(Category.create).toHaveBeenCalledWith(newCategory);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error happened"
        })


    });


});

describe("Testing the findAll method", () => {


    it("Test the find all method when no any param was passed", async () => {

        //Mock the findAll method of the category controller
        const spy = jest.spyOn(Category, 'findAll').mockImplementation(() => Promise.resolve(newCategory));

        //Invoke the method
        await categoryController.findAll(req, res);

        //Validations
        expect(spy).toHaveBeenCalled();
        expect(Category.findAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(newCategory);

    });

    it("Test the find all method when query param was passed", async () => {
        //Mock the findAll method where param was passed

        const query = {
            where: {
                name: "Electronics",
            }
        };

        const spy = jest.spyOn(Category, 'findAll').mockImplementation((query) => Promise.resolve(newCategory))

        req.query = {
            name: "Electronics"
        }

        //Execute the method
        await categoryController.findAll(req, res);

        //Validations
        expect(spy).toHaveBeenCalled();
        expect(Category.findAll).toHaveBeenCalledWith(query);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(newCategory);

    })
});

describe("Testing the update method", () => {


    it("Test the update method", async () => {
        //Mock the update method of the category controller

        const spyOnUpdate = jest.spyOn(Category, 'update').mockImplementation(() => Promise.resolve(updatedCategory))

        const spyOnFindByPk = jest.spyOn(Category, 'findByPk').mockImplementation(() => Promise.resolve(updatedCategory))

        // Set the request parameters
        req.params = {
            id: 1
        }

        // Set the request body
        req.body = updatedCategory;

        //Execute
        await categoryController.update(req, res);

        //validation
        await expect(spyOnUpdate).toHaveBeenCalled();
        expect(Category.update).toHaveBeenCalledWith(req.body, {
            where: {
                id: req.params.id
            },
            returning: true
        });
        await expect(spyOnFindByPk).toHaveBeenCalled();
        expect(category.findByPk).toHaveBeenCalledWith(req.params.id);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(updatedCategory);



    })
})


describe("Testing the findOne method", () => {

    it("Testing with given param of findOne method", async () => {
        //Mock the findByPk method of Category model
        const spyOnFindByPk = jest.spyOn(category, 'findByPk').mockImplementation(() => Promise.resolve(newCategory));

        //Set request params
        req.params = {
            id: 1
        }

        //Execute the findOne method
        await categoryController.findOne(req, res);

        //Validation
        //Expect findByPk method to have been called
        await expect(spyOnFindByPk).toHaveBeenCalled();
        //Expect findByPk method to have been called with the given category ID
        expect(category.findByPk).toHaveBeenCalledWith(req.params.id);
        //Expect response status to have been set to 201
        expect(res.status).toHaveBeenCalledWith(201);
        //Expect response to have been sent with the mock product data
        expect(res.send).toHaveBeenCalledWith(newCategory);
    });
});


describe("Testing the delete method", () => {

    it("testing with param of delete method", async () => {
        //Mock the destroy method of category model
        const spyOndestroy = jest.spyOn(Category, 'destroy').mockImplementation(() => Promise.resolve(newCategory))

        //Set request params
        req.params = {
            id: 1
        }

        //Execute 
        await categoryController.delete(req, res);

        //Validation
        await expect(spyOndestroy).toHaveBeenCalled();
        expect(Category.destroy).toHaveBeenCalledWith({
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

