import { describe, test, jest, expect, beforeEach, beforeAll, afterAll, afterEach } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { Role, User } from "../../src/components/user";
import { UserNotAdminError, UserNotFoundError } from "../../src/errors/userError";

jest.mock("../../src/dao/userDAO")

const testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "");
const testAdmin = new User("admin", "admin", "admin", Role.ADMIN, "", "");
let userController: UserController;

describe("Unit tests for UserController", () => {
    beforeAll(() => {
        userController = new UserController();
    });

    afterAll(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe("createUser(...)", () => {
        //Example of a unit test for the createUser method of the UserController
        //The test checks if the method returns true when the DAO method returns true
        //The test also expects the DAO method to be called once with the correct parameters
        test("Success - should return true", async () => {
            const testUser = { //Define a test user object
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            }
            jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); //Mock the createUser method of the DAO
            //const controller = new UserController(); //Create a new instance of the controller
            //Call the createUser method of the controller with the test user object
            const response = await userController.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);
        
            //Check if the createUser method of the DAO has been called once with the correct parameters
            expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role);
            expect(response).toBe(true); //Check if the response is true
        });
    });

    describe("getUser()", () => {
        test("Success - should return User[]", async () => {
            jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValueOnce([testCustomer]);
            const response = await userController.getUsers();
            expect(UserDAO.prototype.getUsers).toHaveBeenCalledTimes(1);
            expect(response).toStrictEqual([testCustomer]);
        });
    });

    describe("getUsersByRole(...)", () => {
        test("Success - should return User[]", async () => {
            const testRole = "Customer";
            jest.spyOn(UserDAO.prototype, "getUsers").mockResolvedValueOnce([testCustomer]);
            const response = await userController.getUsersByRole(testRole);
            expect(UserDAO.prototype.getUsers).toHaveBeenCalled();
            expect(response).toStrictEqual([testCustomer]);
        });

        test("Generic error from DAO", async () => {
            const testRole = "Customer";
            const err = new Error('DAO error');   // simulate a DAO fail
            jest.spyOn(UserDAO.prototype, "getUsers").mockRejectedValueOnce(err);
            const response = userController.getUsersByRole(testRole);
            await expect(response).rejects.toEqual(err);
            expect(UserDAO.prototype.getUsers).toHaveBeenCalled();
        });
    });

    describe("getUserByUsername(...)", () => {
        test("Success - should return User", async () => {
            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(testCustomer);
            const response = await userController.getUserByUsername(testAdmin, testCustomer.username);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalled();
            expect(response).toStrictEqual(testCustomer);
        });

        test("Generic error from DAO", async () => {
            const err = new Error('DAO error');   // simulate a DAO fail
            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValueOnce(err);
            const response = userController.getUserByUsername(testAdmin, testCustomer.username);
            await expect(response).rejects.toEqual(err);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalled();
        });

        test("User is not an Admin", async () => {
            const response = userController.getUserByUsername(testCustomer, testAdmin.username);
            await expect(response).rejects.toEqual(new UserNotAdminError);
        });
    });
    
    describe("usernameAlreadyInUse(...)", () => {
        test("Username is already in use", async () => {
            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(testCustomer);
            const response = await userController.usernameAlreadyInUse(testCustomer.username);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalled();
            expect(response).toBe(true);
        });

        test("Username not in use yet", async () => {
            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValueOnce(UserNotFoundError);
            const response = await userController.usernameAlreadyInUse(testCustomer.username);
            expect(response).toBe(false);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalled();
        });

        test("Generic error from DAO", async () => {
            const err = new Error('DAO error');   // simulate a DAO fail
            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValueOnce(err);
            const response = userController.usernameAlreadyInUse(testCustomer.username);
            await expect(response).rejects.toEqual(err);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalled();
        });
    });

    describe("deleteUser(...)", () => {
        test("Success - should return true", async () => {
            jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);
            const response = await userController.deleteUser(testAdmin, testCustomer.username);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalled();
            expect(response).toStrictEqual(true);
        });

        test("Generic error from DAO", async () => {
            const err = new Error('DAO error');   // simulate a DAO fail
            jest.spyOn(UserDAO.prototype, "deleteUser").mockRejectedValueOnce(err);
            const response = userController.deleteUser(testAdmin, testCustomer.username);
            await expect(response).rejects.toEqual(err);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalled();
        });

        test("User is not an Admin", async () => {
            const response = userController.deleteUser(testCustomer, testAdmin.username);
            await expect(response).rejects.toEqual(new UserNotAdminError);
        });
    });

    describe("deleteAll()", () => {
        test("Success - should return true", async () => {
            jest.spyOn(UserDAO.prototype, "deleteAll").mockResolvedValueOnce(true);
            const response = await userController.deleteAll();
            expect(UserDAO.prototype.deleteAll).toHaveBeenCalled();
            expect(response).toStrictEqual(true);
        });

        test("Generic error from DAO", async () => {
            const err = new Error('DAO error');   // simulate a DAO fail
            jest.spyOn(UserDAO.prototype, "deleteAll").mockRejectedValueOnce(err);
            const response = userController.deleteAll();
            await expect(response).rejects.toEqual(err);
            expect(UserDAO.prototype.deleteAll).toHaveBeenCalled();
        });
        
        test("Users not found", async () => {
            jest.spyOn(UserDAO.prototype, "deleteAll").mockResolvedValueOnce(false);
            const response = userController.deleteAll();
            await expect(response).rejects.toEqual(new UserNotFoundError);
            expect(UserDAO.prototype.deleteAll).toHaveBeenCalled();
        });
    });
});