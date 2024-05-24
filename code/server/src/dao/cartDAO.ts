/**
 * A class that implements the interaction with the database for all cart-related operations.
 */

import { Cart, ProductInCart } from "../components/cart";
import db from "../db/db";

const mapRowsToCart = (cartRows: any, productRows: any): Cart[] => {
  const carts: Cart[] = [];

  cartRows.forEach((cartRow: any) => {
    let currentCart = new Cart(cartRow.username, cartRow.paid, cartRow.paymentDate, 0, []);

    productRows.forEach((productRow: any) => {
      if (productRow.cartID === cartRow.cartID) {
        currentCart.products.push(
          new ProductInCart(
            productRow.model,
            productRow.quantity,
            productRow.category,
            productRow.sellingPrice
          )
        );

        currentCart.total += productRow.total;
      }
    });

    carts.push(currentCart);
  });

  return carts;
};

class CartDAO {
  /**
   *
   * @returns
   */
  getCarts(): Promise<Cart[]> {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT cartID, username, paid, paymentDate FROM CART C, USERS U WHERE C.userID = U.userID";

      db.all(query, [], (err, cartRows) => {
        if (err) {
          reject(err);
        }

        const query =
          "SELECT cartID, sellingPrice, model, category, CP.quantity, SUM(sellingPrice*CP.quantity) AS total FROM CARTPRODUCTS CP, PRODUCTS P WHERE CP.productID = P.productID GROUP BY cartID, model";

        db.all(query, [], (err, productRows) => {
          if (err) {
            reject(err);
          }

          const carts = mapRowsToCart(cartRows, productRows);

          resolve(carts);
        });
      });
    });
  }

  /**
   *
   * @param username
   * @returns
   */
  getUserCarts(username: String): Promise<Cart[]> {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT cartID, username, paid, paymentDate FROM CART C, USERS U WHERE C.userID = U.userID AND username = ?";

      db.all(query, [username], (err, cartRows) => {
        if (err) {
          reject(err);
        }

        const query =
          "SELECT cartID, sellingPrice, model, category, CP.quantity, SUM(sellingPrice*CP.quantity) AS total FROM CARTPRODUCTS CP, PRODUCTS P WHERE CP.productID = P.productID GROUP BY cartID, model";

        db.all(query, [], (err, productRows) => {
          if (err) {
            reject(err);
          }

          const carts = mapRowsToCart(cartRows, productRows);

          resolve(carts);
        });
      });
    });
  }
}

export default CartDAO;
