import { describe, test, jest, expect, beforeEach, beforeAll, afterAll, afterEach } from "@jest/globals";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import CartDAO from "../../src/dao/cartDAO";
import { Cart, ProductInCart } from "../../src/components/cart";

jest.mock("../../src/db/db.ts");

let cartDAO: CartDAO;

let testCustomerUsername = "customer";
let testCustomerCartID = 1;
let testCartRows: any = [
  {
    cartID: testCustomerCartID,
    username: testCustomerUsername,
    paid: 0,
    paymentDate: "",
  },
];
let testProductInCartRows: any = [
  {
    cartID: testCustomerCartID,
    selliingPrice: 100,
    model: "iPhone 16",
    category: "Smartphone",
    quantity: 2,
    total: 200,
  },
];
let testCartResult: Cart = new Cart(
  testCartRows[0].username,
  testCartRows[0].paid,
  testCartRows[0].paymentDate,
  testProductInCartRows[0].total,
  [
    new ProductInCart(
      testProductInCartRows[0].model,
      testProductInCartRows[0].quantity,
      testProductInCartRows[0].category,
      testProductInCartRows[0].sellingPrice
    ),
  ]
);

beforeEach(async () => {
  cartDAO = new CartDAO();
});

afterEach(async () => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("getCarts", () => {
  test("All carts retrieved correctly", async () => {
    const mockDBAll1 = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(null, testCartRows);
      return {} as Database;
    });

    const mockDBAll2 = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(null, testProductInCartRows);
      return {} as Database;
    });

    const result = cartDAO.getCarts();
    await expect(result).resolves.toStrictEqual([testCartResult]);
    expect(mockDBAll1).toHaveBeenCalled();
    expect(mockDBAll2).toHaveBeenCalled();
  });

  test("First db all call fails. DB FAILS", async () => {
    const error = new Error("DB ERROR");

    const mockDBAll = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(error);
      return {} as Database;
    });

    const result = cartDAO.getCarts();
    await expect(result).rejects.toStrictEqual(error);
    expect(mockDBAll).toHaveBeenCalled();
  });

  test("Second db all fails. DB FAILS", async () => {
    const error = new Error("DB ERROR");

    const mockDBAll1 = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(null, testCartRows);
      return {} as Database;
    });

    const mockDBAll2 = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(error);
      return {} as Database;
    });

    const result = cartDAO.getCarts();
    await expect(result).rejects.toStrictEqual(error);
    expect(mockDBAll1).toHaveBeenCalled();
    expect(mockDBAll2).toHaveBeenCalled();
  });
});

describe("getUserCarts", () => {
  test("All user carts retrieved correctly", async () => {
    const mockDBAll1 = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(null, testCartRows);
      return {} as Database;
    });

    const mockDBAll2 = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(null, testProductInCartRows);
      return {} as Database;
    });

    const result = cartDAO.getUserCarts(testCartRows[0].username);
    await expect(result).resolves.toStrictEqual([testCartResult]);
    expect(mockDBAll1).toHaveBeenCalled();
    expect(mockDBAll2).toHaveBeenCalled();
  });

  test("First db all call fails. DB FAILS", async () => {
    const error = new Error("DB ERROR");

    const mockDBAll = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(error);
      return {} as Database;
    });

    const result = cartDAO.getUserCarts(testCartRows[0].username);
    await expect(result).rejects.toStrictEqual(error);
    expect(mockDBAll).toHaveBeenCalled();
  });

  test("Second db all fails. DB FAILS", async () => {
    const error = new Error("DB ERROR");

    const mockDBAll1 = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(null, testCartRows);
      return {} as Database;
    });

    const mockDBAll2 = jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
      callback(error);
      return {} as Database;
    });

    const result = cartDAO.getUserCarts(testCartRows[0].username);
    await expect(result).rejects.toStrictEqual(error);
    expect(mockDBAll1).toHaveBeenCalled();
    expect(mockDBAll2).toHaveBeenCalled();
  });
});

describe("getUserCurrentCart", () => {
  test("User current cart retrieved correctly", async () => {
    jest.spyOn(CartDAO.prototype, "getUserCarts").mockResolvedValueOnce([testCartResult]);

    const result = cartDAO.getUserCurrentCart(testCustomerUsername);
    await expect(result).resolves.toStrictEqual(testCartResult);
    expect(CartDAO.prototype.getUserCarts).toHaveBeenCalled();
    expect(CartDAO.prototype.getUserCarts).toHaveBeenCalledWith(testCustomerUsername);
  });

  test("User does not have carts", async () => {
    jest.spyOn(CartDAO.prototype, "getUserCarts").mockResolvedValueOnce([]);

    const result = cartDAO.getUserCurrentCart(testCustomerUsername);
    await expect(result).resolves.toStrictEqual(undefined);
    expect(CartDAO.prototype.getUserCarts).toHaveBeenCalled();
    expect(CartDAO.prototype.getUserCarts).toHaveBeenCalledWith(testCustomerUsername);
  });

  test("GetUserCarts call fails, DB FAILS", async () => {
    const error = new Error("DB ERROR");

    jest.spyOn(CartDAO.prototype, "getUserCarts").mockRejectedValueOnce(error);

    const result = cartDAO.getUserCurrentCart(testCustomerUsername);
    await expect(result).rejects.toStrictEqual(error);
    expect(CartDAO.prototype.getUserCarts).toHaveBeenCalled();
    expect(CartDAO.prototype.getUserCarts).toHaveBeenCalledWith(testCustomerUsername);
  });
});
/*
describe("getDummyCart", () => {
  test("Dummy cart retrieved correctly", async () => {
    const result = cartDAO.getDummyCart(testCustomerUsername);

    expect(result).toStrictEqual(new Cart(testCustomerUsername, false, null, 0, []));
  });
});
*/
describe("getCurrentCartID", () => {
  test("Cart id retrieved correctly", async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
      callback(null, { cartID: testCustomerCartID });
      return {} as Database;
    });

    const result = cartDAO.getCurrentCartId(testCustomerUsername);
    await expect(result).resolves.toStrictEqual(testCustomerCartID);
    expect(mockDBGet).toHaveBeenCalled();
  });

  test("Customer does not have a current cart", async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
      callback(null, undefined);
      return {} as Database;
    });

    const result = cartDAO.getUserCurrentCart(testCustomerUsername);
    await expect(result).resolves.toStrictEqual(undefined);
    expect(mockDBGet).toHaveBeenCalled();
  });

  test("Db get call fails, DB FAILS", async () => {
    const error = new Error("DB ERROR");

    const mockDBGet = jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
      callback(error);
      return {} as Database;
    });

    const result = cartDAO.getCurrentCartId(testCustomerUsername);
    await expect(result).rejects.toStrictEqual(error);
    expect(mockDBGet).toHaveBeenCalled();
  });
});

describe("", () => {
  test("", async () => {});
});
