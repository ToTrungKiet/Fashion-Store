import crypto from "crypto";
import moment from "moment";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key];
    });
  return sorted;
}

function buildQuery(params) {
  return Object.entries(params)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value)).replace(/%20/g, "+")}`;
    })
    .join("&");
}

export const createPayment = async (req, res) => {
  try {
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = "http://localhost:5173/payment-success";

    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu đơn hàng",
      });
    }

    // Trừ số lượng kho hàng
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

    vnp_Params = sortObject(vnp_Params);

    const hashData = buildQuery(vnp_Params);

    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(hashData, "utf-8"))
      .digest("hex");

    const paymentUrl = `${vnpUrl}?${buildQuery(vnp_Params)}&vnp_SecureHash=${secureHash}`;

    return res.json({
      success: true,
      paymentUrl,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("createPayment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const secretKey = process.env.VNP_HASHSECRET;

    let vnp_Params = { ...req.query };
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const signData = buildQuery(vnp_Params);

    const checkSum = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    if (secureHash !== checkSum) {
      return res.json({
        success: false,
        message: "Sai chữ ký",
      });
    }

    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (responseCode === "00") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Đơn hàng đã đặt",
      });

      await userModel.findByIdAndUpdate(order.userId, {
        cartData: {},
      });

      return res.json({
        success: true,
        message: "Thanh toán thành công",
      });
    } else {
      // Hoàn lại kho hàng nếu thanh toán thất bại
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

      return res.json({
        success: false,
        message: "Thanh toán thất bại",
      });
    }
  } catch (error) {
    console.log("verifyPayment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Retry payment cho đơn hàng chờ thanh toán
export const retryPayment = async (req, res) => {
  try {
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = "http://localhost:5173/payment-success";

    const { orderId } = req.body;

    // Tìm đơn hàng
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra đơn hàng có phải đang chờ thanh toán không
    if (order.payment === true) {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng này đã được thanh toán",
      });
    }

    if (order.paymentMethod !== "vnpay") {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng này không sử dụng phương thức VNPay",
      });
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

    vnp_Params = sortObject(vnp_Params);

    const hashData = buildQuery(vnp_Params);

    const secureHash = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(hashData, "utf-8"))
      .digest("hex");

    const paymentUrl = `${vnpUrl}?${buildQuery(vnp_Params)}&vnp_SecureHash=${secureHash}`;

    return res.json({
      success: true,
      paymentUrl,
      orderId: order._id,
    });
  } catch (error) {
    console.log("retryPayment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};