import orderService from "../services/orderService.js";

class OrderController {
  placeOrder = async (req, res) => {
    try {
      await orderService.placeOrder(req.user.id, req.body);

      return res.json({
        success: true,
        message: "Đặt hàng thành công !",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  allOrders = async (req, res) => {
    try {
      const orders = await orderService.getAllOrders();

      return res.json({
        success: true,
        message: "Danh sách đơn hàng !",
        orders,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  userOrders = async (req, res) => {
    try {
      const orders = await orderService.getUserOrders(req.user.id);

      return res.json({
        success: true,
        message: "Đơn hàng của bạn !",
        orders,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  updateStatus = async (req, res) => {
    try {
      await orderService.updateStatus(req.body.orderId, req.body.status);

      return res.json({
        success: true,
        message: "Cập nhật trạng thái thành công !",
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
}

export default new OrderController();
