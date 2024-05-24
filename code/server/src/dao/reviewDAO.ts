import db from "../db/db"

import { ProductReview } from "../components/review";
/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */

function mapRowsToReviews(rows: any[]): ProductReview[] {
  return rows.map(
    (row) =>
      new ProductReview(
        row.model,
        row.username,
        row.score,
        row.date,
        row.comment
      )
  );
}

class ReviewDAO {
  getReviewsByProduct(model: String) {
    return new Promise <ProductReview[]>((resolve, reject) => {
      const sql =
        "SELECT P.model, U.username, R.score, R.date, R.comment FROM review AS R, users AS U, products AS P WHERE R.userID=U.userID AND R.productID=P.productID AND P.model = ?";

      db.all(sql, [model], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(mapRowsToReviews(rows));
        }
      });
    });
  }

  addProductReview(model: string, username: String, score: number, comment: string, date: String) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT U.userID, P.productID FROM users AS U, products AS P, cart AS C, cartProducts AS CP WHERE U.userID=C.userID AND P.productID=CP.productID AND C.cartID=CP.cartID AND U.username = ? AND P.model = ? AND C.paid = 1";

        db.get(sql, [username, model], (err, row :any) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({error: "Product not found in users's purchased products"});
            } else {
                sql = "INSERT INTO REVIEW (userID, productID, score, date, comment) VALUES (?, ?, ?, ?, ?)";
                db.run(sql, [row.userID, row.productID, score, date, comment], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes);
                    }
                })
            }
        })
    })
  }

  deleteUserReview(model: String, username: String) {
    return new Promise <void>((resolve, reject) => {
        let sql = "SELECT R.reviewID FROM review AS R, users AS U, products AS P WHERE R.userID=U.userID AND R.productID=P.productID AND U.username = ? AND P.model = ?";

        db.get(sql, [username, model], (err, row :any) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(/*{error: "Review not found"}*/);
            } else {
                sql = "DELETE FROM review WHERE reviewID = ?";
                db.run(sql, [row.productID], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(/*this.changes*/);
                    }
                })
            }
        })
    })
  }

  deleteProductReviews(model: string) {
    return new Promise <void>((resolve, reject) => {
        let sql = "SELECT productID FROM products WHERE model = ?";

        db.get(sql, [model], (err, row :any) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(/*{error: "Product not found"}*/);
            } else {
                sql = "DELETE FROM review WHERE productID = ?";
                db.run(sql, [row.productID], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(/*this.changes*/);
                    }
                })
            }
        })
    })
  }

  deleteReviews() {
    return new Promise <void>((resolve, reject) => {
        const sql = "DELETE FROM REVIEW";

        db.run(sql, [], function (err) {
            if (err) {
              reject(err);
            }
            resolve(/*this.changes*/);
          });
    })
  }

}

export default ReviewDAO;
