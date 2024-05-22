import { User } from "../components/user";
import ReviewDAO from "../dao/reviewDAO";

function getCurrentDate(): string {
    const currentDate = new Date().toISOString().slice(0, 10);
    return currentDate;
}

class ReviewController {
    private dao: ReviewDAO

    constructor() {
        this.dao = new ReviewDAO
    }

    /**
     * Adds a new review for a product
     * @param model The model of the product to review
     * @param user The username of the user who made the review
     * @param score The score assigned to the product, in the range [1, 5]
     * @param comment The comment made by the user
     * @returns A Promise that resolves to nothing
     */
    async addReview(model: string, user: User, score: number, comment: string) /**:Promise<void> */ { 
        return this.dao.addProductReview(model, user.username, score, comment, getCurrentDate());
    }

    /**
     * Returns all reviews for a product
     * @param model The model of the product to get reviews from
     * @returns A Promise that resolves to an array of ProductReview objects
     */
    async getProductReviews(model: string) /**:Promise<ProductReview[]> */ { 
        return this.dao.getReviewsByProduct(model);
    }

    /**
     * Deletes the review made by a user for a product
     * @param model The model of the product to delete the review from
     * @param user The user who made the review to delete
     * @returns A Promise that resolves to nothing
     */
    async deleteReview(model: string, user: User) /**:Promise<void> */ { 
        return this.dao.deleteUserReview(model, user.username);
    }

    /**
     * Deletes all reviews for a product
     * @param model The model of the product to delete the reviews from
     * @returns A Promise that resolves to nothing
     */
    async deleteReviewsOfProduct(model: string) /**:Promise<void> */ { 
        return this.dao.deleteProductReviews(model);
    }

    /**
     * Deletes all reviews of all products
     * @returns A Promise that resolves to nothing
     */
    async deleteAllReviews() /**:Promise<void> */ {
        return this.dao.deleteReviews();
     }
}

export default ReviewController;