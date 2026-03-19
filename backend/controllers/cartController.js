import cartService from "../services/cartService.js";

class CartController {

  addToCart = async (req, res) => {
    try {
      const cart = await cartService.addToCart(req.user, req.body);

      return res.json({
        success: true,
        message: "Đã thêm vào giỏ hàng !",
        data: cart
      });

    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  updateCart = async (req, res) => {
    try {
      await cartService.updateCart(
        req.user.id,
        req.body
      );

      return res.json({
        success: true,
        message: "Cập nhật giỏ hàng thành công !",
      });

    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  getUserCart = async (req, res) => {
    try {
      const cartData = await cartService.getCart(req.user.id);

      return res.json({
        success: true,
        cartData
      });

    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };
}

export default new CartController();