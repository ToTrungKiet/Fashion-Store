import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import crypto from "crypto";
import qs from "qs";
import moment from "moment";

class OrderController {
  // Route đặt hàng sử dụng phướng thức cod
  async placeOrder(req, res) {
    try {
      const {items, amount, address } = req.body;
      const userId = req.user.id;

      // Giảm số lượng kho hàng
      for (const item of items) {
        const sizeColorKey = `${item.size}-${item.color}`;
        const product = await productModel.findById(item._id);
        if (product) {
          const sizeColorQuantity = product.sizeColorQuantity;
          const currentQuantity = sizeColorQuantity.get(sizeColorKey) || 0;
          const newQuantity = Math.max(0, currentQuantity - item.quantity);
          sizeColorQuantity.set(sizeColorKey, newQuantity);
          await product.save();
          console.log(
            `Updated ${product.name} ${sizeColorKey}: ${currentQuantity} -> ${newQuantity}`,
          );
        }
      }

      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "cod",
        payment: false,
      };
      const newOrder = new orderModel(orderData);
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Đặt hàng thành công !" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route đặt hàng sử dụng phương thức zalopay
  async placeOrderVNPay(req, res) {
    try {
      const { amount } = req.body;

      const tmnCode = "DEMOV210";
      const secretKey = "SECRETKEYVNPAY";

      const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
      const returnUrl = "http://localhost:5173/payment-success";

      const date = new Date();

      const createDate = moment(date).format("YYYYMMDDHHmmss");

      const orderId = moment(date).format("HHmmss");

      let vnp_Params = {};

      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = "vn";
      vnp_Params["vnp_CurrCode"] = "VND";
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan don hang";
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = req.ip;
      vnp_Params["vnp_CreateDate"] = createDate;

      vnp_Params = Object.keys(vnp_Params)
        .sort()
        .reduce((result, key) => {
          result[key] = vnp_Params[key];
          return result;
        }, {});

      const signData = qs.stringify(vnp_Params, { encode: false });

      const hmac = crypto.createHmac("sha512", secretKey);

      const signed = hmac.update(signData).digest("hex");

      vnp_Params["vnp_SecureHash"] = signed;

      const paymentUrl =
        vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

      res.json({
        success: true,
        paymentUrl,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route lấy tất cả đơn hàng của người dùng
  async allOrders(req, res) {
    try {
      const orders = await orderModel.find({});
      res.json({ success: true, orders });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route lấy các đơn hàng của người dùng
  async userOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await orderModel.find({ userId });
      if (orders) {
        res.json({ success: true, orders });
      } else {
        res.json({ success: false, message: "Không tìm thấy đơn hàng nào !" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route cập nhật trạng thái đơn hàng (dành cho admin)
  async updateStatus(req, res) {
    try {
      const { orderId, status } = req.body;
      await orderModel.findByIdAndUpdate(orderId, { status });
      res.json({ success: true, message: "Trạng thái đã được cập nhật !" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new OrderController();
