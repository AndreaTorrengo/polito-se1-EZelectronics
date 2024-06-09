import { describe, test, jest, expect, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals'
import ReviewDAO from '../../src/dao/reviewDAO'
import { Database } from 'sqlite3';
import db from '../../src/db/db'
import ReviewController from '../../src/controllers/reviewController';
import { User, Role } from '../../src/components/user';
import { ExistingReviewError, NoReviewProductError } from '../../src/errors/reviewError';
import ProductDAO from '../../src/dao/productDAO';
import { Category, Product } from '../../src/components/product';

jest.mock("../../src/dao/reviewDAO");

// For testing purpose, user is always undefined (cannot mock login module)
let testReviewJson = { model: "test-product", user: "test-customer", score: 4, date: "2024-05-31", comment: "test-comment" };
let testCustomer = new User("test-customer", "name", "surname", Role.CUSTOMER, "", "");
let reviewController: ReviewController;

describe("Unit tests for ReviewController", () => {
  beforeEach(() => {
    reviewController = new ReviewController();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("addReview(...)", () => {
    test("Success - should return void", async () => {
      jest.spyOn(ReviewDAO.prototype, "addProductReview").mockResolvedValueOnce(1); // this.changes

      const result = await reviewController.addReview(testReviewJson.model, testCustomer, testReviewJson.score, testReviewJson.comment);
      expect(result).toBeUndefined();
    });

    test("Already existing review - should return ExistingReviewError", async () => {
      /*const mockDAO = jest.spyOn(ReviewDAO.prototype, "addProductReview").mockImplementation(
        (model: string, username: String, score: number, comment: string, date: String) => {
          return Promise.resolve(0);
        });*/
      // Both mockImplementation and mockResolvedValueOnce works. This one is quicker
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "addProductReview").mockResolvedValueOnce(0);

      const result = reviewController.addReview(testReviewJson.model, testCustomer, testReviewJson.score, testReviewJson.comment);
      await expect(result).rejects.toEqual(new ExistingReviewError());
      expect(mockDAO).toHaveBeenCalled();
    });

    test("DAO fail - should return the thrown error", async () => {
      const err = new Error('DAO error');   // simulate a DAO fail
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "addProductReview").mockRejectedValueOnce(err);
      const result = reviewController.addReview(testReviewJson.model, testCustomer, testReviewJson.score, testReviewJson.comment);
      await expect(result).rejects.toEqual(err);
      expect(mockDAO).toHaveBeenCalled();
    });
  });

  describe("getProductReviews(model)", () => {
    test("Success - should return ProductReview[]", async () => {
      const mockDAOproducts = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(new Product(1,'a', Category.APPLIANCE, null, null, 1));
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "getReviewsByProduct").mockResolvedValueOnce([testReviewJson]);

      const result = await reviewController.getProductReviews(testReviewJson.model);
      expect(result).toEqual([testReviewJson]);
      expect(mockDAO).toHaveBeenCalled();
      expect(mockDAOproducts).toHaveBeenCalled();
    });

    test("DAO fail - should return the thrown error", async () => {
      const err = new Error();
      const mockDAOproducts = jest.spyOn(ProductDAO.prototype, "getProductByModel").mockResolvedValueOnce(new Product(1,'a', Category.APPLIANCE, null, null, 1));
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "getReviewsByProduct").mockRejectedValueOnce(err);

      const result = reviewController.getProductReviews(testReviewJson.model);
      await expect(result).rejects.toEqual(err);
      expect(mockDAO).toHaveBeenCalled();
      expect(mockDAOproducts).toHaveBeenCalled();
    });
  });

  describe("deleteReview(model, user)", () => {
    test("Success - should return void", async () => {
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "deleteUserReview").mockResolvedValueOnce();

      const result = await reviewController.deleteReview(testReviewJson.model, testCustomer);
      expect(result).toBeUndefined();
      expect(mockDAO).toHaveBeenCalled();
    });
  });

  describe("deleteReviewsOfProduct(model)", () => {
    test("Success - should return void", async () => {
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "deleteProductReviews").mockResolvedValueOnce(1); // this.changes

      const result = await reviewController.deleteReviewsOfProduct(testReviewJson.model);
      expect(result).toBeUndefined();
      expect(mockDAO).toHaveBeenCalled();
    });

    test("Review does not exists - should return NoReviewProductError", async () => {
      const err = new NoReviewProductError();
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "deleteProductReviews").mockResolvedValueOnce(0); // this.changes

      const result = reviewController.deleteReviewsOfProduct(testReviewJson.model);
      await expect(result).rejects.toEqual(err);
      expect(mockDAO).toHaveBeenCalled();
    });

    test("DAO fail - should return the thrown error", async () => {
      const err = new Error("DAO fail");
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "deleteProductReviews").mockRejectedValueOnce(err);

      const result = reviewController.deleteReviewsOfProduct(testReviewJson.model);
      await expect(result).rejects.toEqual(err);
      expect(mockDAO).toHaveBeenCalled();
    });
  });

  describe("deleteReviewsOfProduct(model)", () => {
    test("Success - should return void", async () => {
      const mockDAO = jest.spyOn(ReviewDAO.prototype, "deleteReviews").mockResolvedValueOnce();

      const result = await reviewController.deleteAllReviews();
      expect(result).toBeUndefined();
      expect(mockDAO).toHaveBeenCalled();
    });
  });
});