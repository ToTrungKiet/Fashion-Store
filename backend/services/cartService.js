import userModel from "../models/userModel.js";

class CartService {
  async addToCart(user, { itemId, size, color }) {
    if (user.role === "admin") {
      throw new Error("Admin không được phép thêm vào giỏ hàng");
    }

    if (!itemId || !size || !color) {
      throw new Error("Thiếu dữ liệu");
    }

    const userData = await userModel.findById(user.id);
    if (!userData) throw new Error("Không tìm thấy user");

    const cartData = userData.cartData || {};
    const sizeColorKey = `${size}-${color}`;

    if (cartData[itemId]) {
      if (cartData[itemId][sizeColorKey]) {
        cartData[itemId][sizeColorKey] += 1;
      } else {
        cartData[itemId][sizeColorKey] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][sizeColorKey] = 1;
    }

    await userModel.findByIdAndUpdate(user.id, { cartData });

    return cartData;
  }

  async updateCart(userId, { itemId, size, color, quantity }) {
    if (quantity < 0) throw new Error("Số lượng không hợp lệ !");

    const userData = await userModel.findById(userId);
    if (!userData) throw new Error("Không tìm thấy user !");

    const cartData = userData.cartData || {};
    const sizeColorKey  = `${size}-${color}`;

    if (!cartData[itemId]) {
      throw new Error("Sản phẩm chưa có trong giỏ !");
    }

    cartData[itemId][sizeColorKey ] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

    return cartData;
  }

  async getCart(userId) {
    const userData = await userModel.findById(userId);
    if (!userData) throw new Error("Không tìm thấy user !");

    return userData.cartData || {};
  }
}

export default new CartService();
