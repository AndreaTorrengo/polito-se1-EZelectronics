import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  jest,
} from "@jest/globals";


import productController from "../../src/controllers/productController"
import db from "../../src/db/db";
import { Database } from "sqlite3";
import { SpyInstance } from "jest-mock";
import ProductDAO from "../../src/dao/productDAO";
import { Category, Product } from "../../src/components/product";

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

      const result = await productDAO.insertProduct(new Product(150, "prova", Category.APPLIANCE, null, null, 10));
      expect(result).toBe(true);
    });

});

describe("Delete product", () => {
  beforeEach(() => {
    productDAO = new ProductDAO();
  });

  afterEach(() => {
    
  });
});
