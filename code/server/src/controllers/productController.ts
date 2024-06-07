import ProductDAO from "../dao/productDAO";
import { Product, Category } from "../components/product";
import {
  EmptyProductStockError,
  LowProductStockError,
  ProductAlreadyExistsError,
  ProductNotFoundError,
} from "../errors/productError";
import { DateError } from "../utilities";

const now = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Represents a controller for managing products.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class ProductController {
  private dao: ProductDAO;

  constructor() {
    this.dao = new ProductDAO();
  }

  /**
   * Registers a new product concept (model, with quantity defining the number of units available) in the database.
   * @param model The unique model of the product.
   * @param category The category of the product.
   * @param quantity The number of units of the new product.
   * @param details The optional details of the product.
   * @param sellingPrice The price at which one unit of the product is sold.
   * @param arrivalDate The optional date in which the product arrived.
   * @returns A Promise that resolves to nothing.
   */
  async registerProducts(
    model: string,
    category: string,
    quantity: number,
    details: string | null,
    sellingPrice: number,
    arrivalDate: string | null
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.dao.getProductByModel(model);

        if (product instanceof Product) {
          throw new ProductAlreadyExistsError();
        }

        const date = arrivalDate ? arrivalDate : now();

        if (date > now()) {
          throw new DateError();
        }

        const newProduct = new Product(sellingPrice, model, category as Category, date, details, quantity);

        const changes = await this.dao.insertProduct(newProduct);

        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Increases the available quantity of a product through the addition of new units.
   * @param model The model of the product to increase.
   * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
   * @param changeDate The optional date in which the change occurred.
   * @returns A Promise that resolves to the new available quantity of the product.
   */
  async changeProductQuantity(
    model: string,
    newQuantity: number,
    changeDate: string | null
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const oldProduct = await this.dao.getProductByModel(model);

        if (oldProduct instanceof ProductNotFoundError) {
          throw new ProductNotFoundError();
        }

        const date = changeDate ? changeDate : now();

        if (date > now() || date < oldProduct.arrivalDate) {
          throw new DateError();
        }

        const newProduct = new Product(
          oldProduct.sellingPrice,
          model,
          oldProduct.category,
          changeDate ? changeDate : new Date().toISOString().split("T")[0],
          oldProduct.details,
          newQuantity + oldProduct.quantity
        );

        const changes = await this.dao.updateProduct(newProduct, model);

        resolve(newQuantity + oldProduct.quantity);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Decreases the available quantity of a product through the sale of units.
   * @param model The model of the product to sell
   * @param quantity The number of product units that were sold.
   * @param sellingDate The optional date in which the sale occurred.
   * @returns A Promise that resolves to the new available quantity of the product.
   */
  async sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const oldProduct = await this.dao.getProductByModel(model);

        if (oldProduct instanceof ProductNotFoundError) {
          throw new ProductNotFoundError();
        }

        if (oldProduct.quantity === 0) {
          throw new EmptyProductStockError();
        }

        const newQuantity = oldProduct.quantity - quantity;

        if (newQuantity < 0) {
          throw new LowProductStockError();
        }

        const date = sellingDate ? sellingDate : now();

        if (date > now() || date < oldProduct.arrivalDate) {
          throw new DateError();
        }

        const newProduct = new Product(
          oldProduct.sellingPrice,
          model,
          oldProduct.category,
          oldProduct.arrivalDate,
          oldProduct.details,
          newQuantity
        );

        const changes = await this.dao.updateProduct(newProduct, model);

        resolve(newQuantity);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Returns all products in the database, with the option to filter them by category or model.
   * @param grouping An optional parameter. If present, it can be either "category" or "model".
   * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
   * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
   * @returns A Promise that resolves to an array of Product objects.
   */
  async getProducts(
    grouping: string | null,
    category: string | null,
    model: string | null
  ): Promise<Product[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let products = await this.dao.getProducts();

        if (grouping === "category" && (category as Category)) {
          products = products.filter((p) => p.category === category);
        } else if (grouping === "model" && model) {
          products = products.filter((p) => p.model === model);

          if (products.length === 0) {
            throw new ProductNotFoundError();
          }
        }

        resolve(products);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Returns all available products (with a quantity above 0) in the database, with the option to filter them by category or model.
   * @param grouping An optional parameter. If present, it can be either "category" or "model".
   * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
   * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
   * @returns A Promise that resolves to an array of Product objects.
   */
  async getAvailableProducts(
    grouping: string | null,
    category: string | null,
    model: string | null
  ): Promise<Product[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const products = (await this.dao.getProducts()).filter((p) => p.quantity > 0);

        if (grouping === "category" && (category as Category)) {
          resolve(products.filter((p) => p.category === category));
        } else if (grouping === "model" && model) {
          resolve(products.filter((p) => p.model === model));
        }

        resolve(products);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Deletes all products.
   * @returns A Promise that resolves to `true` if all products have been successfully deleted.
   */
  async deleteAllProducts(): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const changes = await this.dao.deleteProducts();

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Deletes one product, identified by its model
   * @param model The model of the product to delete
   * @returns A Promise that resolves to `true` if the product has been successfully deleted.
   */
  async deleteProduct(model: string): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const oldProduct = await this.dao.getProductByModel(model);

        if (oldProduct instanceof ProductNotFoundError) {
          throw new ProductNotFoundError();
        }

        const changes = await this.dao.deleteProductByModel(model);

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default ProductController;
