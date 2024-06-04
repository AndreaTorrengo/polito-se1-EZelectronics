import { describe, test, jest, expect, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals'
import ReviewDAO from '../../src/dao/reviewDAO'
import { Database } from 'sqlite3';
import db from '../../src/db/db'
import { ProductReview } from '../../src/components/review';

jest.mock("../../src/db/db.ts");

let reviewDAO: ReviewDAO;
// For testing purpose, user is always undefined (cannot mock login module)
let testReviewJson = {model: "test-product", score: 4, date: "2024-05-31", comment: "test-comment"};

describe("Unit tests for ReviewDAO", () => {
  beforeEach(() => {
    reviewDAO = new ReviewDAO();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getReviewsByProduct(model)", () => {
    test("Success - Should return a ProductReview[] type", async () => {
      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, [testReviewJson]);   // function(err, rows) sqlite
        return {} as Database;
      });
  
      const result = await reviewDAO.getReviewsByProduct(testReviewJson.model);
      expect(result).toEqual([testReviewJson]);
      expect(mockDBAll).toHaveBeenCalled();
    });

    test("Generic fail - Should return the thrown error", async () => {
      const err = new Error("generic error");
      const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(err);   // function(err, rows) sqlite
        return {} as Database;
      });
  
      const result = reviewDAO.getReviewsByProduct(testReviewJson.model);
      await expect(result).rejects.toEqual(err);  // await promise to return reject
      expect(mockDBAll).toHaveBeenCalled();
    });
  });

  describe("addProductReview(...)", () => {
    test("Success - Should return 1 (this.changes)", async () => {
      // Assuming that the product has been purchased by the user
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, [testReviewJson]);
        return {} as Database;
      });
      // Assuming that the review has successfully been inserted
      const mockDBRun = jest.spyOn(db, "run").mockImplementation(function(sql, params, callback) {
        callback.call({changes: 1}, null);  // (this.changes, err) sqlite
        return {} as Database;
      });

      const result = await reviewDAO.addProductReview(
        testReviewJson.model, 'test-username', testReviewJson.score, testReviewJson.comment, testReviewJson.date
      );
      expect(result).toBe(1);
      expect(mockDBGet).toHaveBeenCalled();
      expect(mockDBRun).toHaveBeenCalled();
    });

    test("Generic fail - Should return the thrown error", async () => {
      const err = new Error("generic error");
      // Simulate generic fail
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(err, [testReviewJson]);
        return {} as Database;
      });

      const result = reviewDAO.addProductReview(
        testReviewJson.model, 'test-username', testReviewJson.score, testReviewJson.comment, testReviewJson.date
      );
      await expect(result).rejects.toEqual(err);
      expect(mockDBGet).toHaveBeenCalled();
    });

    test("Product not found in purchased cart - Should return error", async () => {
      // Simulate generic fail
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
      });

      const result = reviewDAO.addProductReview(
        testReviewJson.model, 'test-username', testReviewJson.score, testReviewJson.comment, testReviewJson.date
      );
      await expect(result).resolves.toEqual({error: "Product not found in users's purchased products"});
      expect(mockDBGet).toHaveBeenCalled();
    });
  });

  describe("deleteUserReview(model, username)", () => {
    test("Success - Should return nothing (undefined)", async () => {
      // Assuming that the product has been purchased by the user
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, [testReviewJson]);
        return {} as Database;
      });
      // Assuming that the review has successfully been deleted
      const mockDBRun = jest.spyOn(db, "run").mockImplementation(function(sql, params, callback) {
        callback.call({changes: 1}, null);  // (this.changes, err) sqlite
        return {} as Database;
      });
      
      const result = await reviewDAO.deleteUserReview(testReviewJson.model, 'test-username');
      //expect(result).toBe(1);
      expect(result).toBeUndefined();
      expect(mockDBGet).toHaveBeenCalled();
      expect(mockDBRun).toHaveBeenCalled();
    });

    test("Review not found - Should return nothing (undefined)", async () => {
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
      });
      
      const result = await reviewDAO.deleteUserReview(testReviewJson.model, 'test-username');
      await expect(result).resolves.toBe("");
      expect(mockDBGet).toHaveBeenCalled();
    });
  });

  describe("deleteProductReviews(model)", () => {
    test("Success - Should return 1 (this.changes)", async () => {
      // Assuming that the user is manager or admin
      const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, [testReviewJson]);
        return {} as Database;
      });
      // Assuming that all reviews have successfully been deleted
      const mockDBRun = jest.spyOn(db, "run").mockImplementation(function(sql, params, callback) {
        callback.call({changes: 1}, null);  // (this.changes, err) sqlite
        return {} as Database;
      });
      
      const result = await reviewDAO.deleteProductReviews(testReviewJson.model);
      expect(result).toBe(1);
      expect(mockDBGet).toHaveBeenCalled();
      expect(mockDBRun).toHaveBeenCalled();
    });
  });

  describe("deleteReviews()", () => {
    test("Success - Should return nothing (undefined)", async () => {
      // Assuming that the user is manager or admin
      // Assuming that all reviews have successfully been deleted
      const mockDBRun = jest.spyOn(db, "run").mockImplementation(function(sql, params, callback) {
        callback.call({changes: 1}, null);  // (this.changes, err) sqlite
        return {} as Database;
      });
      
      const result = await reviewDAO.deleteReviews();
      expect(result).toBeUndefined();
      expect(mockDBRun).toHaveBeenCalled();
    });
  });
});