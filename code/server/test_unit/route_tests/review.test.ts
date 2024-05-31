import { test, expect, jest, describe } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"

import ReviewController from "../../src/controllers/reviewController"
import Authenticator from "../../src/routers/auth"
import { Role, User } from "../../src/components/user"
import { ProductReview } from "../../src/components/review"
import ErrorHandler from "../../src/helper"
import { Category, Product } from "../../src/components/product"
const baseURL = "/ezelectronics"


jest.mock("../../src/controllers/userController")
jest.mock("../../src/routers/auth")

let testAdmin = new User("admin", "admin", "admin", Role.ADMIN, "", "")
let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")
//let testProduct = new Product(100, 'test-product', Category.APPLIANCE, null, null, 10)
let testReview = new ProductReview("test-product", "customer", 4, "2024-05-31", "test-comment")

describe("Route unit tests", () => {
  // Add a review for a given product model
  describe("Route for adding a review", () => {
    test("POST reviews/:model", async () => {
      //We mock the express-validator 'body' method to return a mock object with the methods we need to validate the input parameters
      //These methods all return an empty object, because we are not testing the validation logic here (we assume it works correctly)
      jest.mock('express-validator', () => ({
        body: jest.fn().mockImplementation(() => ({
          isString: () => ({ isLength: () => ({}) }),
          isIn: () => ({ isLength: () => ({}) }),
        })),
      }))
      //We mock the ErrorHandler validateRequest method to return the next function, because we are not testing the validation logic here (we assume it works correctly)
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        return next();
      });
      // We mock the 'isCustomer' method to return the next function, because we are not testing the Authenticator logic here (we assume it works correctly)
      jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
        return next();
    })
      //We mock the ReviewController addReview method to return void, because we are not testing the ReviewController logic here (we assume it works correctly)
      jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce();

      /*We send a request to the route we are testing. We are in a situation where:
          - The input parameters are 'valid' (= the validation logic is mocked to be correct)
          - The review creation function is 'successful' (= the ReviewController logic is mocked to be correct)
          We expect the 'addReview' function to have been called with the input parameters and to return a 200 success code
          Since we mock the dependencies and we are testing the route in isolation, we do not need to check that the review has actually been created
      */
      const jsonReview = {model: 'test-product', user: testCustomer, score: 4, comment: 'test-comment'}
      const response = await request(app).post(baseURL + "/reviews/test-product").send(jsonReview);
      expect(response.status).toBe(200);
      expect(ReviewController.prototype.addReview).toHaveBeenCalled();
      expect(ReviewController.prototype.addReview).toHaveBeenCalledWith(jsonReview.model, undefined, jsonReview.score, jsonReview.comment);
    });
  });

  describe("Route for retrieving all reviews of a product.", () => {
    test("GET reviews/:model", async () => {
      //We mock the express-validator 'body' method to return a mock object with the methods we need to validate the input parameters
      //These methods all return an empty object, because we are not testing the validation logic here (we assume it works correctly)
      jest.mock('express-validator', () => ({
        body: jest.fn().mockImplementation(() => ({
          isString: () => ({ isLength: () => ({}) }),
          isIn: () => ({ isLength: () => ({}) }),
        })),
      }))
      //We mock the ErrorHandler validateRequest method to return the next function, because we are not testing the validation logic here (we assume it works correctly)
      jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
        return next();
      });
      // We mock the 'isLoggedIn' method to return the next function, because we are not testing the Authenticator logic here (we assume it works correctly)
      jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
        return next();
    })
      //We mock the ReviewController getProductReviews method to return ProductReview[], because we are not testing the ReviewController logic here (we assume it works correctly)
      jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce([testReview]);

      /*We send a request to the route we are testing. We are in a situation where:
          - The input parameters are 'valid' (= the validation logic is mocked to be correct)
          - The review creation function is 'successful' (= the ReviewController logic is mocked to be correct)
          We expect the 'getProductReviews' function to have been called with the input parameters and to return a 200 success code
          Since we mock the dependencies and we are testing the route in isolation, we do not need to check that the review has actually been created
      */
      const response = await request(app).get(baseURL + "/reviews/test-product");
      expect(response.status).toBe(200);
      expect(ReviewController.prototype.getProductReviews).toHaveBeenCalled();
      expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith(testReview.model);
    });
  });
});