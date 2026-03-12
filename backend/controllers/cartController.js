import userModel from '../models/userModel.js';


class CartController {

  // Route thêm sản phẩm vào giỏ hàng người dùng
  async addToCart(req, res) {
    try {
        const { userId, itemId, size, color } = req.body;
        const userData = await userModel.findById(userId);
        const cartData = userData.cartData;
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
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Đã thêm vào giỏ hàng!" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route cập nhật giỏ hàng người dùng
  async updateCart(req, res) {
    try {
        const { userId, itemId, size, color, quantity } = req.body;
        const userData = await userModel.findById(userId);
        const cartData = userData.cartData;
        const sizeColorKey = `${size}-${color}`;
        cartData[itemId][sizeColorKey] = quantity;
        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Đã cập nhật giỏ hàng!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route dữ liệu giỏ hàng người dùng
  async getUserCart(req, res) {
    try {
      const { userId } = req.body;
      const userData = await userModel.findById(userId);
      let cartData = userData.cartData;
      res.json({ success: true, cartData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

}

export default new CartController();
