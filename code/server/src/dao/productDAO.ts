/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */

import db from "../db/db";

import { Product } from "../components/product";

function mapRowsToFilm(rows: any[]): Product[] {
  return rows.map(
    (row) =>
      new Product(
        row.sellingPrice,
        row.model,
        row.category,
        row.arrivalDate,
        row.details,
        row.quantity
      )
  );
}

class ProductDAO {
  getProducts() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM PRODUCTS";

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(mapRowsToFilm(rows));
      });
    });
  }

  getProductByModel(model: String) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM PRODUCTS WHERE model = ?";

      db.get(query, [model], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve({ error: "Product not found, check the inserted model!" });
        }

        resolve(mapRowsToFilm([row])[0]);
      });
    });
  }

  insertProduct(newProduct: Product) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO PRODUCTS (sellingPrice, model, category, arrivalDate, details, quantity) VALUES (?, ?, ?, ?, ?, ?)";

      db.run(
        query,
        [
          newProduct.sellingPrice,
          newProduct.model,
          newProduct.category,
          newProduct.arrivalDate,
          newProduct.details,
          newProduct.quantity,
        ],
        function (err) {
          if (err) {
            reject(err);
          }

          resolve(this.changes);
        }
      );
    });
  }

  updateProduct(newProduct: Product, model: String) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE PRODUCTS SET sellingPrice = ?, category = ?, arrivalDate = ?, details = ?, quantity = ? WHERE model = ?";

      db.run(
        query,
        [
          newProduct.sellingPrice,
          newProduct.category,
          newProduct.arrivalDate,
          newProduct.details,
          newProduct.quantity,
          model
        ],
        function (err) {
          if (err) {
            reject(err);
          }

          resolve(this.changes);
        }
      );
    });
  }

  deleteProductByID(model: String) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM PRODUCTS WHERE model = ?";

      db.run(query, [model], function (err) {
        if (err) {
          reject(err);
        }

        resolve(this.changes);
      });
    });
  }
}

export default ProductDAO;
