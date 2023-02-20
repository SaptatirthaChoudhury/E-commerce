
const jwt = require("jsonwebtoken");
const config = require('../../../configs/secret.config');
const AuthController = require('../../../controllers/auth.controller');
const Models = require('../../../models');
const UserModel = Models.user;
const RoleModel = Models.role;
const newUser = require('../../unitTest/mockData/newUser.json');
const userData = require('../../unitTest/mockData/userData.json');
const { mockRequest, mockResponse } = require('../interceptor');
const bcrypt = require("bcryptjs");



/**
 * Some kind of prep work before the tests are executed
 */

let req, res;

beforeEach(async () => {
    //Whatever that I write here, will be executed before every describe test
    req = mockRequest();
    res = mockResponse();

})

/**
 * Test the signup method
 * 
 *   1. Successfull signup
 *     1.a. When we provide the roles to a user
 *     1.b. When we don't provide the roles to a user
 *   2. SignUp failed
 * 
 * We are doing 3 tests, under one broad topic which is SignUp
 */


describe('AuthController.signup', () => {

    beforeEach(() => {
        req.body = newUser;
    });

    const resFromCreate = {
        setRoles: async () => Promise.resolve(),
    }

    it('should return user registered success message', async () => {
        const spyOnCreate = jest.spyOn(UserModel, 'create')
            .mockImplementation(() => Promise.resolve(resFromCreate)
            );
        const spyOnFindAll = jest.spyOn(RoleModel, 'findAll')
            .mockImplementation(() => Promise.resolve()
            );

        await AuthController.signup(req, res);


        await expect(spyOnCreate).toHaveBeenCalled();
        await expect(spyOnFindAll).toHaveBeenCalled();
        await expect(UserModel.create).toHaveBeenCalled();
        await expect(RoleModel.findAll).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: "User successfully registered" });
    });


})
