import { test, expect, jest, describe, beforeAll } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";

import CartController from "../../src/controllers/cartController";
import Authenticator from "../../src/routers/auth";
import { Role, User } from "../../src/components/user";
import { Cart, ProductInCart } from "../../src/components/cart";
import ErrorHandler from "../../src/helper";
import { Category, Product } from "../../src/components/product";
import { EmptyProductStockError, ProductNotFoundError } from "../../src/errors/productError";

const baseURL = "/ezelectronics";

jest.mock("../../src/controllers/userController");
jest.mock("../../src/routers/auth");

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "");
let testProduct = new Product(100, "test-product", Category.APPLIANCE, null, null, 10);

describe("Route for adding a product to a given cart", () => {
  test("POST carts", async () => {
    jest.mock("express-validator", () => ({
      param: jest.fn().mockImplementation(() => ({
        isString: () => ({ isLength: () => ({}) }),
        isIn: () => ({ isLength: () => ({}) }),
      })),
    }));

    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
    jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true);

    const testBody = { user: testCustomer, model: testProduct.model };
    const response = await request(app)
      .post(baseURL + "/carts")
      .send(testBody);
    expect(response.status).toBe(200);
    expect(CartController.prototype.addToCart).toHaveBeenCalled();
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(undefined, testBody.model);
  });

  test("Product does not exist. Should return 404", async () => {
    jest.mock("express-validator", () => ({
      param: jest.fn().mockImplementation(() => ({
        isString: () => ({ isLength: () => ({}) }),
        isIn: () => ({ isLength: () => ({}) }),
      })),
    }));

    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
    jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new ProductNotFoundError());

    const testBody = { user: testCustomer, model: testProduct.model };
    const response = await request(app)
      .post(baseURL + "/carts")
      .send(testBody);
    expect(response.status).toBe(404);
    expect(CartController.prototype.addToCart).toHaveBeenCalled();
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(undefined, testBody.model);
  });

  test("Product is not available. Should return 409", async () => {
    jest.mock("express-validator", () => ({
      param: jest.fn().mockImplementation(() => ({
        isString: () => ({ isLength: () => ({}) }),
        isIn: () => ({ isLength: () => ({}) }),
      })),
    }));

    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
    jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new EmptyProductStockError());

    const testBody = { user: testCustomer, model: testProduct.model };
    const response = await request(app)
      .post(baseURL + "/carts")
      .send(testBody);
    expect(response.status).toBe(409);
    expect(CartController.prototype.addToCart).toHaveBeenCalled();
    expect(CartController.prototype.addToCart).toHaveBeenCalledWith(undefined, testBody.model);
  });
});
