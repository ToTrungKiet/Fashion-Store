import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";


class OrderController {

  // Route đặt hàng sử dụng phướng thức cod
  async placeOrder(req, res) {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
          userId,
          items,
          address,
          amount,
          paymentMethod: 'cod',
          payment: false
        }
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {cartData: {}})
        res.json({ success: true, message: 'Đặt hàng thành công !' });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route đặt hàng sử dụng phương thức momo
  async placeOrderMomo(req, res) {
    try {
        
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route đặt hàng sử dụng phương thức zalopay
  async placeOrderZalopay(req, res) {
    try {
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route lấy tất cả đơn hàng của người dùng
  async allOrders(req, res) {
    try {
      const orders = await orderModel.find({})
      res.json({success: true, orders})
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route lấy các đơn hàng của người dùng
  async userOrders(req, res) {
    try {
      const { userId } = req.body;
      const orders = await orderModel.find({userId})
      if (orders) {
        res.json({ success: true, orders })
      } else {
        res.json({ success: false, message: 'Không tìm thấy đơn hàng nào !' })
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route cập nhật trạng thái đơn hàng (dành cho admin)
  async updateStatus(req, res) {
    try {
      const { orderId, status } = req.body
      await orderModel.findByIdAndUpdate(orderId, {status})
      res.json({success: true, message: 'Trạng thái đã được cập nhật !'})
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

}

export default new OrderController();
