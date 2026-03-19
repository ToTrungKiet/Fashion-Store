import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

class ProductService {
  async addProduct(data, files) {
    const image1 = files.image1?.[0];
    const image2 = files.image2?.[0];
    const image3 = files.image3?.[0];
    const image4 = files.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item != undefined,
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const parsedSizes = JSON.parse(data.sizes);
    const parsedSizeColorQuantity = data.sizeColorQuantity
      ? JSON.parse(data.sizeColorQuantity)
      : {};
    const parsedColors = data.colors
      ? JSON.parse(data.colors)
      : ["Trắng", "Đen", "Xám"];

    const newProduct = {
      ...data,
      price: Number(data.price),
      bestseller: data.bestseller === "true" ? true : false,
      sizes: parsedSizes,
      colors: parsedColors,
      sizeColorQuantity: parsedSizeColorQuantity,
      image: imagesUrl,
    };

    const product = new productModel(newProduct);
    await product.save();

    return product;
  }

  async listProducts() {
    return await productModel.find({});
  }

  async removeProduct(id) {
    const product = await productModel.findByIdAndDelete(id);
    if (!product) throw new Error("Không tìm thấy sản phẩm");
    return product;
  }

  async singleProduct(productId) {
    const product = await productModel.findById(productId);
    if (!product) throw new Error("Không tìm thấy sản phẩm");
    return product;
  }

  async updateProduct(id, data, files) {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Không tìm thấy sản phẩm");

    // Cập nhật trường cơ bản
    if (data.name) product.name = data.name;
    if (data.description) product.description = data.description;
    if (data.price) product.price = Number(data.price);
    if (data.category) product.category = data.category;
    if (data.subCategory) product.subCategory = data.subCategory;
    if (typeof data.bestseller !== "undefined")
      product.bestseller = data.bestseller === "true" ? true : false;

    if (data.sizes) {
      const parsedSizes = JSON.parse(data.sizes);
      product.sizes = parsedSizes;
    }

    if (data.sizeColorQuantity) {
      const parsedSizeColorQuantity = JSON.parse(data.sizeColorQuantity);
      product.sizeColorQuantity = parsedSizeColorQuantity;
    }

    if (data.colors) {
      const parsedColors = JSON.parse(data.colors);
      product.colors = parsedColors;
    }

    // Xử lý hình ảnh mới nếu có
    const image1 = files.image1?.[0];
    const image2 = files.image2?.[0];
    const image3 = files.image3?.[0];
    const image4 = files.image4?.[0];
    const images = [image1, image2, image3, image4].filter(
      (item) => item != undefined,
    );
    if (images.length) {
      let imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        }),
      );
      product.image = imagesUrl;
    }

    await product.save();
    return product;
  }

  async getInventory() {
    return await productModel.find({});
  }

  async updateQuantity({ id, size, color, quantity }) {
    if (quantity < 0) throw new Error("Số lượng không hợp lệ");

    const product = await productModel.findById(id);
    if (!product) throw new Error("Không tìm thấy sản phẩm");

    const key = `${size}-${color}`;
    product.sizeColorQuantity.set(key, Number(quantity));

    await product.save();
    return product;
  }

  async restock({ id, size, color, addQuantity }) {
    if (addQuantity <= 0) throw new Error("Số lượng phải > 0");

    const product = await productModel.findById(id);
    if (!product) throw new Error("Không tìm thấy sản phẩm");

    const key = `${size}-${color}`;
    const currentQuantity = product.sizeColorQuantity.get(key) || 0;

    product.sizeColorQuantity.set(key, currentQuantity + Number(addQuantity));

    await product.save();

    return product;
  }

  async getBestSellers() {
    const orders = await orderModel.find({});
    const productSales = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        productSales[item._id] =
          (productSales[item._id] || 0) + (item.quantity || 1);
      });
    });

    const bestSellers = await productModel.find({});

    const productsWithSales = bestSellers
      .map((product) => ({
        ...product.toObject(),
        sold: productSales[product._id] || 0,
      }))
      .sort((a, b) => b.sold - a.sold);

    return productsWithSales;
  }
}

export default new ProductService();
