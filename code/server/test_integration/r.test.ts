import { describe, test, expect, beforeAll, afterAll } from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import { cleanup } from "../src/db/cleanup"
import { Category } from "../src/components/product"
import ProductDAO from "../src/dao/productDAO"
import CartDAO from "../src/dao/cartDAO"
import { ExistingReviewError } from "../src/errors/reviewError"
import { ProductNotInCartError } from "../src/errors/cartError"

const routePath = "/ezelectronics" //Base route path for the API

//Default user information. We use them to create users and evaluate the returned values
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" };
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" };
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" };
// Review data
const product = {model: 'test-model', quantity: 3, category: Category.APPLIANCE, details: 'some details', sellingPrice: 50, arrivalDate: '2024-06-06'};
const product2 = {model: 'test-model-2', quantity: 3, category: Category.SMARTPHONE, details: 'other details', sellingPrice: 20, arrivalDate: '2024-06-06'};
const review = {model: product.model, user: customer.username, score: 4, comment: 'test comment', date: '2024-06-06'};
//Cookies for the users. We use them to keep users logged in. Creating them once and saving them in a variables outside of the tests will make cookies reusable
let customerCookie: string;
let adminCookie: string;
let managerCookie: string;
let productDAO: ProductDAO;
let cartDAO: CartDAO;

//Helper function that creates a new user in the database.
//Can be used to create a user before the tests or in the tests
//Is an implicit test because it checks if the return code is successful
const postUser = async (userInfo: any) => {
  await request(app)
    .post(`${routePath}/users`)
    .send(userInfo)
    //.expect(200);
}

//Helper function that logs in a user and returns the cookie
//Can be used to log in a user before the tests or in the tests
const login = async (userInfo: any) => {
  return new Promise<string>((resolve, reject) => {
    request(app)
      .post(`${routePath}/sessions`)
      .send(userInfo)
      //.expect(200)
      .end((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res.header["set-cookie"][0])
      })
  })
}

/*const logout = async () => {
  return new Promise((resolve,reject) => {
    request(app)
    .delete(`${routePath}/sessions/current`)
    .expect(200)
    .end((err, res) => {
      if(err) reject(err);
      else resolve(undefined);
    });
  });
}*/

const addProduct = (productData: any) => {
  return productDAO.insertProduct(productData);
  /*new Promise((resolve, reject) => {
    request(app)
      .post(`${routePath}/products`)
      .set('Cookie', managerCookie)
      .send(productData)
      .then(() => resolve(undefined))
      .catch((err) => reject(err))
    //expect(response.status).toBe(200);
  });*/
};

// Add product to cart, then checkout
const purchaseProduct = async (username: String, productModel: string) => {
  return cartDAO.addToUserCart(username, productModel).then(() => cartDAO.checkoutUserCart(username));
  /*new Promise((resolve, reject) => {
    request(app)
      .post(`${routePath}/carts`)
      .send(productModel)
      .set('Cookie', customerCookie)
      .then(() => {
        request(app)
        .patch(`${routePath}/carts`)
        .set('Cookie', customerCookie)
        .then(() => resolve(undefined))
      }).catch((err) => reject(err));
  });*/
};

//Before executing tests, we remove everything from our test database, create an Admin user and log in as Admin, saving the cookie in the corresponding variable
beforeAll(async () => {
  cleanup()
  productDAO = new ProductDAO;
  cartDAO = new CartDAO;

  // admin login
  await postUser(admin);
  adminCookie = await login(admin);
  // customer login
  await postUser(customer);
  customerCookie = await login(customer);
  // manager login
  await postUser(manager);
  managerCookie = await login(manager);
  
  await addProduct(product);            // Manager inserts a new product
  await addProduct(product2);            // Manager inserts a new product
  await purchaseProduct(customer.username, product.model); // Customer purchase the first product
})

//After executing tests, we remove everything from our test database
afterAll(() => {
  cleanup()
})

describe("Review routes integration tests", () => {
  describe("Route for adding a new review for a product - POST /:model", () => {
    test("Create a new review - Should return 200 success", async () => {
      const response = await request(app)
      .post(`${routePath}/reviews/${review.model}`)
      .set("Cookie", customerCookie).send(review);

      expect(response.status).toBe(200);
    });
    test("Manager attemps to write a review - Should return 401 unauthorized", async () => {
      const response = await request(app)
      .post(`${routePath}/reviews/${review.model}`)
      .set("Cookie", managerCookie).send(review);
      expect(response.status).toBe(401);
    });
    // We have used reviewID as primary key, so it is possible, without any other checks, to write multiple reviews for the same product by the same user
    /*test("Customer has already reviewed the product - Should return ExistingReviewError", async () => {
      const response = await request(app)
      .post(`${routePath}/reviews/${review.model}`)
      .set("Cookie", customerCookie).send(review);

      expect(response.status).toBe(new ExistingReviewError().customCode);
    });*/
    test("Customer has not purchased the product - Should return the thrown error", async () => {
      const err = new ProductNotInCartError();
      const response = await request(app)
      .post(`${routePath}/reviews/${product2.model}`)
      .set("Cookie", customerCookie)
      .send({model: product2.model, user: 'customer', score: 4, comment: 'test comment'});

      expect(response.status).toEqual(err.customCode);
      expect(JSON.parse(response.text).error).toEqual(err.customMessage);
    });
  });
});