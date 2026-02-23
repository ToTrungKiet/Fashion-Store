import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js';
// import cartModel from '../models/cartModel.js';


class CartController {

  // Route thêm sản phẩm vào giỏ hàng người dùng
  async addToCart(req, res) {
    try {
        const { userId, itemId, size } = req.body;
        const userData = await userModel.findById(userId);
        const cartData = userData.cartData;
        if (cartData[itemId]) {
          if (cartData[itemId][size]) {
            cartData[itemId][size] += 1;
          } else {
            cartData[itemId][size] = 1;
          }
        } else {
          cartData[itemId] = {};
          cartData[itemId][size] = 1;
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
        const { userId, itemId, size, quantity } = req.body;
        const userData = await userModel.findById(userId);
        const cartData = userData.cartData;
        cartData[itemId][size] = quantity;
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
