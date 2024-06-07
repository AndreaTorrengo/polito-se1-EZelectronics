import { test, expect, jest, describe, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../index";
import CartController from "../src/controllers/cartController";
import Authenticator from "../src/routers/auth";
import { Role, User } from "../src/components/user";
import { Cart, ProductInCart } from "../src/components/cart";
import { Category, Product } from "../src/components/product";
import {
  EmptyProductStockError,
  LowProductStockError,
  ProductNotFoundError,
} from "../src/errors/productError";
import {
  CartNotFoundError,
  EmptyCartError,
  ProductNotInCartError,
  ProductInCartError,
} from "../src/errors/cartError";
import CartDAO from "../src/dao/cartDAO";
import ProductDAO from "../src/dao/productDAO";
import ProductController from "../src/controllers/productController";
import { cleanup } from "../src/db/cleanup";

const baseURLCart = "/ezelectronics/carts";
const baseURLProduct = "/ezelectronics/products";
const baseURLUser = "/ezelectronics/users";
const baseURLSession = "/ezelectronics/sessions";

let testCustomer = {
  username: "customer-username",
  name: "customer-name",
  surname: "customer-surname",
  role: "Customer",
  password: "password",
};
let testManager = {
  username: "manager-username",
  name: "manager-name",
  surname: "manager-surname",
  role: "Manager",
  password: "password",
};
let testAdmin = {
  username: "admin-username",
  name: "admin-name",
  surname: "admin-surname",
  role: "Admin",
  password: "password",
};
let testProduct1 = {
  model: "P1",
  category: "Smartphone",
  quantity: 5,
  details: "",
  sellingPrice: 200,
  arrivalDate: "2024-01-01",
};
let testProduct2 = {
  model: "P2",
  category: "Laptop",
  quantity: 5,
  details: "",
  sellingPrice: 200,
  arrivalDate: "2024-01-01",
};
let testProduct3 = {
  model: "P3",
  category: "Appliance",
  quantity: 5,
  details: "",
  sellingPrice: 200,
  arrivalDate: "2024-01-01",
};

let customerCookie: string;
let adminCookie: string;
let managerCookie: string;

const login = async (userInfo: any) => {
  return new Promise<string>((resolve, reject) => {
    request(app)
      .post(baseURLSession)
      .send(userInfo)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.header["set-cookie"][0]);
        }
      });
  });
};

const addUser = async (userInfo: any) => {
  await request(app).post(baseURLUser).send(userInfo);
};

const addProduct = (productData: any) => {
  return new Promise((resolve, reject) => {
    request(app)
      .post(baseURLProduct)
      .set("Cookie", managerCookie)
      .send(productData)
      .then(() => resolve(undefined))
      .catch((err) => reject(err));
  });
};

beforeAll(async () => {
  cleanup();

  await addUser(testCustomer);
  customerCookie = await login(testCustomer);
  await addUser(testManager);
  managerCookie = await login(testManager);
  await addUser(testAdmin);
  adminCookie = await login(testAdmin);

  await addProduct(testProduct1);
  await addProduct(testProduct2);
  await addProduct(testProduct3);
});

afterAll(() => {
  cleanup();
});

describe("POST ezelectronics/carts", () => {
  test("Product inserted correctly in cart", async () => {
    const response = await request(app)
      .post(baseURLCart)
      .set("Cookie", customerCookie)
      .send({ model: testProduct1.model });

    expect(response.status).toBe(200);
  });

  test("Product already exist", async () => {
    await request(app).post(baseURLCart).set("Cookie", customerCookie).send({ model: testProduct1.model });

    const response = await request(app)
      .post(baseURLCart)
      .set("Cookie", customerCookie)
      .send({ model: testProduct1.model });

    expect(response.status).toBe(409);
  });
});
