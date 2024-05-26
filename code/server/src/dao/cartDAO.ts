/**
 * A class that implements the interaction with the database for all cart-related operations.
 */

import { Cart, ProductInCart } from "../components/cart";
import db from "../db/db";

const mapRowsToCart = (cartRows: any, productRows: any): Cart[] => {
  const carts: Cart[] = [];

  cartRows.forEach((cartRow: any) => {
    let currentCart = new Cart(
      cartRow.username,
      cartRow.paid,
      cartRow.paymentDate,
      0,
      []
    );

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
   * @returns a list of all carts of the given username.
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

  getCurrentCartId(username: String): Promise<Number | undefined> {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT cartID FROM cart AS C, user AS U WHERE C.userID=U.userID AND C.paid=0 AND U.username=?";
      db.get(sql, [username], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(row);
        } else {
          resolve(row.cartID);
        }
      });
    });
  }

  insertNewProductInCart(cartId: Number, productId: Number): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO cartProducts (cartID, productID, quantity) VALUES (?,?,1)";
      db.run(sql, [cartId, productId], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  createNewCart(username: String, productId: Number): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT userID FROM users WHERE username=?";
      db.get(sql, [username], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(false);
        } else {
          sql = "INSERT INTO cart (userID, paid) VALUES (?, 0)";
          db.run(sql, [row.userID], async (err) => {
            if (err) {
              reject(err);
            } else {
              const cartId = await this.getCurrentCartId(username);
              if (cartId === undefined) {
                resolve(false);
              }
              resolve(await this.insertNewProductInCart(cartId, productId));
            }
          });
        }
      });
    });
  }

  addToUserCart(username: String, model: String): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT productID FROM products WHERE quantity>0 AND model=?";
      db.get(sql, [model], async (errProductId, rowProductId: any) => {
        if (errProductId) {
          reject(errProductId);
        } else if (rowProductId === undefined) {
          resolve(false);
        } else {
          const cartId = await this.getCurrentCartId(username);
          if (cartId === undefined) {
            //cart does not exists
            //(create cart and add product with quantity 1)
            resolve(await this.createNewCart(username, rowProductId.productID));
          } else {
            //cart exists
            sql = "SELECT * FROM cartProduct WHERE cartID=? AND productID=?";
            db.get(sql, [cartId, rowProductId.productID], async (err, row) => {
              if (err) {
                reject(err);
              } else if (row === undefined) {
                //product not in cart
                //(add product in cart with quantity 1)
                resolve(await this.insertNewProductInCart(cartId, rowProductId.productID))
              } else {
                //product already in cart
                //TODO (add 1 to the quantity of existing product)
              }
            });
          }
        }
      });
    });
  }

  checkoutUserCart(username: String) {
    return new Promise((resolve, reject) => {
      let query =
        "SELECT cartID FROM users AS U, cart AS C WHERE U.userID=C.userID AND C.paid=0 AND U.username=?";

      db.get(query, [username], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve({ error: "This user doesn't have a current cart" });
        } else {
          query = "UPDATE cart SET paid=1 WHERE cartID=?";
          db.run(query, [row.cartID], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.changes);
            }
          });
        }
      });
    });
  }

  /**
   * Removes one product unit from the current cart (paid==0). In case there is more than one unit in the cart, only one should be removed.
   * @param user The user who owns the cart.
   * @param product The model of the product to remove.
   * @returns A Promise that resolves to `true` if the product was successfully removed.
   */
  removeProductFromCart(username: string, product: string): Promise<Boolean> {
    return new Promise<Boolean>(async (resolve, reject) => {
      try {
        const cartID = await this.getCurrentCartId(username);

        // if the quantity of the product to remove on the cart is > 1, then set quantity -= 1 of cartProducts record

        // if the quantity is 1, then DELETE cartProducts record

        // if the quantity is 0 or else, reject(...)

        const sql = "todo";
      } catch (error) {
        reject(false);
      }
    });
  }
  /**
   * @returns A Promise that resolves to `true` if all db products are successfully removed.
   */
  deleteAllCarts() {
    return new Promise<Boolean>((resolve, reject) => {
      try {
        const sql = "DELETE FROM carts";
        db.run(sql, function (err) {
          if (err) {
            reject(false);
            return;
          }
          resolve(true);
        });
      } catch (error) {
        reject(false);
      }
    });
  }
}

export default CartDAO;
