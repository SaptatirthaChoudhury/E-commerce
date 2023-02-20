
const { mockRequest, mockResponse } = require("../interceptor");
const newCart = require("../mockData/newCart.json")
const Cart = require("../../../models").cart
const Product = require("../../../models").product
const cartController = require("../../../controllers/cart.controller");
const newCartItems = require("../mockData/new-cart-items.json");
const cartUpdateItems = require("../mockData/updated-cartItems.json")


let req, res;

beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
})



describe("Testing create cart method", () => {

    it("testing cart method", async () => {

        const req = newCart

        const cart = {
            userId: req.userId
        };
        //Mocking the cart method of cart model
        const spyOncart = jest.spyOn(Cart, 'create').mockImplementation((cart) => Promise.resolve(cart));


        //Execute
        await cartController.create(req, res);

        //Validations
        await expect(spyOncart).toHaveBeenCalled();
        expect(Cart.create).toHaveBeenCalledWith(cart);
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(cart)
        console.log(res.send.mock.calls);
    })

    it("Test failure during the creation of a new product", async () => {
        //Write some code to test the failure condition

        //Mock and spy
        const spy = jest.spyOn(Cart, 'create').mockImplementation(() => Promise.reject(Error("Error while creating")));


        const req = newCart

        const cart = {
            userId: req.userId
        };

        //Execute the method
        await cartController.create(req, res);

        //Validation
        await expect(spy).toHaveBeenCalled();
        expect(Cart.create).toHaveBeenCalledWith(cart);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message: "Some internal error happened"
        })
    })
})

describe('CartController.getCart', () => {

    beforeEach(() => {
        req.params = {
            cartId: 1
        };
    });



    it('should call CartController.getCart method ', async () => {

        const resFromFindByPk = {
            id: 1,
            getProducts: () => Promise.resolve(newCartItems.Items)
        }

        const resFromGetCart = {
            id: 1,
            productsSelected: newCartItems.Items,
            cost: 130000
        }

        const spyOnFindByPk = jest.spyOn(Cart, 'findByPk')
            .mockImplementation(
                () => Promise.resolve(resFromFindByPk)
            );

        await cartController.searchById(req, res)

        await expect(spyOnFindByPk).toHaveBeenCalled();
        expect(Cart.findByPk).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(resFromGetCart);
    });

});


describe('CartController.update', () => {

    beforeEach(() => {
        req.body = {
            productIds: 1
        };
        req.params = {
            id: 1
        }
    });

    const resFromFindByPk = {
        id: 1,
        getProducts: () => Promise.resolve(newCartItems.Items),
        setProducts: (newItems) => Promise.resolve()
    }

    const resFromFindAll = {
        items: [
            cartUpdateItems
        ]
    }

    const resFromUpdate = {
        id: 1,
        productsSelected: newCartItems.Items,
        cost: 130000
    }

    it('should call CartController.update method and update category details in DB', async () => {

        const spyOnFindByPk = jest.spyOn(Cart, 'findByPk').mockImplementation(() => Promise.resolve(resFromFindByPk));

        const spyOnFindAll = jest.spyOn(Product, 'findAll').mockImplementation(() => Promise.resolve(resFromFindAll));

        const spyOnUpdate = jest.spyOn(Cart, 'update').mockImplementation(() => Promise.resolve(cartUpdateItems))

        await cartController.update(req, res);


       
        await expect(spyOnFindAll).toHaveBeenCalled();
        await expect(spyOnFindByPk).toHaveBeenCalled();
       
        await expect(Cart.findByPk).toHaveBeenCalled();
        await expect(Cart.update).toHaveBeenCalled();
        console.log(res.send.mock.calls);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(resFromUpdate);


    });

})
