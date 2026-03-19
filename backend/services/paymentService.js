import crypto from "crypto";
import moment from "moment";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

class PaymentService {

  sortObject(obj) {
    const sorted = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = obj[key];
      });
    return sorted;
  }

  buildQuery(params) {
    return Object.entries(params)
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value)).replace(/%20/g, "+")}`;
      })
      .join("&");
  }

  async createPayment(userId, data, req) {
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = "http://localhost:5173/payment-success";

    const { items, amount, address } = data;

    if (!userId || !items || !amount || !address) {
      throw new Error("Thiếu dữ liệu đơn hàng");
    }

    for (const item of items) {
      const sizeColorKey = `${item.size}-${item.color}`;
      const product = await productModel.findById(item._id);
      if (product) {
        const currentQuantity = product.sizeColorQuantity.get(sizeColorKey) || 0;
        const newQuantity = Math.max(0, currentQuantity - item.quantity);
        product.sizeColorQuantity.set(sizeColorKey, newQuantity);
        await product.save();
      }
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: "vnpay",
      payment: false,
      status: "Chờ thanh toán",
    });

    await newOrder.save();

    const now = moment().utcOffset(7);
    const createDate = now.format("YYYYMMDDHHmmss");
    const expireDate = moment().utcOffset(7).add(15, "minutes").format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    if (typeof ipAddr === "string" && ipAddr.includes(",")) {
      ipAddr = ipAddr.split(",")[0].trim();
    }
    if (ipAddr === "::1") ipAddr = "127.0.0.1";
    if (typeof ipAddr === "string" && ipAddr.startsWith("::ffff:")) {
      ipAddr = ipAddr.replace("::ffff:", "");
    }

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: newOrder._id.toString(),
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_OrderType: "other",
      vnp_Amount: Math.round(Number(amount) * 100),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    vnp_Params = this.sortObject(vnp_Params);

    const hashData = this.buildQuery(vnp_Params);

    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(hashData, "utf-8"))
      .digest("hex");

    const paymentUrl = `${vnpUrl}?${this.buildQuery(vnp_Params)}&vnp_SecureHash=${secureHash}`;

    return {
      paymentUrl,
      orderId: newOrder._id,
    };
  }

  async verifyPayment(query) {
    const secretKey = process.env.VNP_HASHSECRET;

    let vnp_Params = { ...query };
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = this.sortObject(vnp_Params);

    const signData = this.buildQuery(vnp_Params);

    const checkSum = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    if (secureHash !== checkSum) {
      throw new Error("Sai chữ ký");
    }

    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];

    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (responseCode === "00") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Đơn hàng đã đặt",
      });

      await userModel.findByIdAndUpdate(order.userId, {
        cartData: {},
      });

      return true;
    } else {
      for (const item of order.items) {
        const sizeColorKey = `${item.size}-${item.color}`;
        const product = await productModel.findById(item._id);
        if (product) {
          const currentQuantity = product.sizeColorQuantity.get(sizeColorKey) || 0;
          const newQuantity = currentQuantity + item.quantity;
          product.sizeColorQuantity.set(sizeColorKey, newQuantity);
          await product.save();
        }
      }

      await orderModel.findByIdAndUpdate(orderId, {
        payment: false,
        status: "Chờ thanh toán",
      });

      return false;
    }
  }

  async retryPayment(orderId, req) {
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = "http://localhost:5173/payment-success";

    const order = await orderModel.findById(orderId);

    if (!order) throw new Error("Không tìm thấy đơn hàng");

    if (order.payment === true) {
      throw new Error("Đơn hàng này đã được thanh toán");
    }

    if (order.paymentMethod !== "vnpay") {
      throw new Error("Đơn hàng này không sử dụng phương thức VNPay");
    }

    const now = moment().utcOffset(7);
    const createDate = now.format("YYYYMMDDHHmmss");
    const expireDate = moment().utcOffset(7).add(15, "minutes").format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    if (typeof ipAddr === "string" && ipAddr.includes(",")) {
      ipAddr = ipAddr.split(",")[0].trim();
    }
    if (ipAddr === "::1") ipAddr = "127.0.0.1";
    if (typeof ipAddr === "string" && ipAddr.startsWith("::ffff:")) {
      ipAddr = ipAddr.replace("::ffff:", "");
    }

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: order._id.toString(),
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_OrderType: "other",
      vnp_Amount: Math.round(Number(order.amount) * 100),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    vnp_Params = this.sortObject(vnp_Params);

    const hashData = this.buildQuery(vnp_Params);

    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(hashData, "utf-8"))
      .digest("hex");

    const paymentUrl = `${vnpUrl}?${this.buildQuery(vnp_Params)}&vnp_SecureHash=${secureHash}`;

    return {
      paymentUrl,
      orderId: order._id,
    };
  }
}

export default new PaymentService();