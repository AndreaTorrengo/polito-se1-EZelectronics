import { test, expect, jest, describe, beforeAll } from "@jest/globals";

import CartController from "../../src/controllers/cartController";
import Authenticator from "../../src/routers/auth";
import { Role, User } from "../../src/components/user";
import { Cart, ProductInCart } from "../../src/components/cart";
import { Category, Product } from "../../src/components/product";
import {
  EmptyProductStockError,
  LowProductStockError,
  ProductNotFoundError,
} from "../../src/errors/productError";
import {
  CartNotFoundError,
  EmptyCartError,
  ProductNotInCartError,
  ProductInCartError,
} from "../../src/errors/cartError";
import CartDAO from "../../src/dao/cartDAO";
import ProductDAO from "../../src/dao/productDAO";

let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "");
let testProduct = new Product(100, "test-product", Category.APPLIANCE, null, null, 10);
let testCart = new Cart(testCustomer.username, false, "", 200, [
  new ProductInCart(testProduct.model, 2, Category.APPLIANCE, 100),
]);
let testPaidCart = new Cart(testCustomer.username, true, "2024-01-01", 200, [
  new ProductInCart(testProduct.model, 2, Category.APPLIANCE, 100),
]);
let testCartArray = [testPaidCart, testPaidCart];

jest.mock("../../src/dao/cartDAO");
jest.mock("../../src/dao/productDAO");

describe("Add a new product to cart", () => {
  test("Product added correctly", async () => {
    jest.spyOn(CartDAO.prototype, "addToUserCart").mockResolvedValueOnce(true);
    jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);

    const controller = new CartController();

    const result = await controller.addToCart(testCustomer, testProduct.model);
    expect(result).toBe(true);
    expect(ProductDAO.prototype.getProductByModel).toHaveBeenCalledTimes(1);
    expect(ProductDAO.prototype.getProductByModel).toBeCalledWith(testProduct.model);
    expect(CartDAO.prototype.addToUserCart).toHaveBeenCalledTimes(1);
    expect(CartDAO.prototype.addToUserCart).toHaveBeenCalledWith(testCustomer.username, testProduct.model);
  });

  test("Product does not exist. Should reject with a ProductNotFoundError", async () => {
    const error = new ProductNotFoundError();

    jest.spyOn(ProductDAO.prototype, "getProductByModel").mockRejectedValueOnce(error);

    const controller = new CartController();

    const result = controller.addToCart(testCustomer, testProduct.model);
    await expect(result).rejects.toThrow(error);
    expect(ProductDAO.prototype.getProductByModel).toHaveBeenCalled();
    expect(ProductDAO.prototype.getProductByModel).toBeCalledWith(testProduct.model);
  });

  test("Product quantity available is zero. Should reject with a EmptyProductStockError", async () => {
    const error = new EmptyProductStockError();

    jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(testProduct);
    jest.spyOn(CartDAO.prototype, "addToUserCart").mockRejectedValueOnce(error);

    const controller = new CartController();

    const result = controller.addToCart(testCustomer, testProduct.model);
    await expect(result).rejects.toThrow(error);
    expect(ProductDAO.prototype.getProductByModel).toHaveBeenCalled();
    expect(ProductDAO.prototype.getProductByModel).toHaveBeenCalledWith(testProduct.model);
  });
});

describe("", () => {
  test("", async () => {});
});