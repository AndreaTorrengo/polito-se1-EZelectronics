import { describe, test, expect, beforeAll, beforeEach, afterAll, afterEach, jest } from "@jest/globals";

import productController from "../../src/controllers/productController";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import { SpyInstance } from "jest-mock";
import ProductDAO from "../../src/dao/productDAO";
import { Category, Product } from "../../src/components/product";
import { ProductAlreadyExistsError, ProductNotFoundError } from "../../src/errors/productError";

let productDAO: ProductDAO;

jest.mock("../../src/db/db.ts");

describe("Insert product", () => {
  beforeEach(() => {
    productDAO = new ProductDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("Product correctly registered", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    const result = await productDAO.insertProduct(
      new Product(150, "prova", Category.APPLIANCE, null, null, 10)
    );
    expect(result).toBe(true);
    expect(mockDBRun).toHaveBeenCalled();
  });

  test("Product already exists", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error(""));
      return {} as Database;
    });

    const result = productDAO.insertProduct(
      new Product(150, "prova prodotto esistente", Category.APPLIANCE, null, null, 10)
    );
    await expect(result).rejects.toEqual(new ProductAlreadyExistsError());
    expect(mockDBRun).toHaveBeenCalled();
  });

  test("Product provides empty parameters", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new Error(""));
      return {} as Database;
    });

    const result = productDAO.insertProduct(
      new Product(150, "prova parametri vuoti", Category.APPLIANCE, null, null, 10)
    );
    await expect(result).rejects.toEqual(new ProductAlreadyExistsError());
    expect(mockDBRun).toHaveBeenCalled();
  });
});

describe("Delete product", () => {
  beforeEach(() => {
    productDAO = new ProductDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("All products correctly deleted", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    const result = await productDAO.deleteProducts();
    expect(result).toBe(true);
    expect(mockDBRun).toHaveBeenCalled();
  });

  test("Product correctly deleted", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    const result = await productDAO.deleteProductByModel("iPhone 15");
    expect(result).toBe(true);
    expect(mockDBRun).toHaveBeenCalled();
  });

  test("Product not found", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(new ProductNotFoundError());
      return {} as Database;
    });

    const result = productDAO.deleteProductByModel("prodottononesistente");
    await expect(result).rejects.toEqual(new ProductNotFoundError());
    expect(mockDBRun).toHaveBeenCalled();
  });
});

describe("Update product", () => {
  beforeEach(() => {
    productDAO = new ProductDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test("Product correctly updated", async () => {
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
      callback(null);
      return {} as Database;
    });

    const result = await productDAO.updateProduct(
      new Product(150, "prova", Category.APPLIANCE, null, null, 10),
      "prova"
    );
    expect(result).toBe(true);
    expect(mockDBRun).toHaveBeenCalled();
  });
});
