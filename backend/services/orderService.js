import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

class OrderService {
  async reduceStock(items) {
    for (const item of items) {
      const sizeColorKey = `${item.size}-${item.color}`;
      const product = await productModel.findById(item._id);
      if (product) {
        const sizeColorQuantity = product.sizeColorQuantity;
        const currentQuantity = sizeColorQuantity.get(sizeColorKey) || 0;
        const newQuantity = Math.max(0, currentQuantity - item.quantity);
        sizeColorQuantity.set(sizeColorKey, newQuantity);
        await product.save();
      }
    }
  }

  async increaseStock(items) {
    for (const item of items) {
      const key = `${item.size}-${item.color}`;

      const product = await productModel.findById(item._id);
      if (!product) continue;

      const current = product.sizeColorQuantity.get(key) || 0;

      product.sizeColorQuantity.set(key, current + item.quantity);
      await product.save();
    }
  }

  async placeOrder(userId, { items, amount, address }) {
    if (!items || !amount || !address) {
      throw new Error("Thiếu dữ liệu đơn hàng !");
    }

    await this.reduceStock(items);

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "cod",
      payment: false,
      status: "Đơn hàng đã đặt",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    return await userModel.findByIdAndUpdate(userId, { cartData: {} });
  }

  async getAllOrders() {
    return await orderModel.find({});
  }

  async getUserOrders(userId) {
    return await orderModel.find({ userId });
  }

  async updateStatus(orderId, status) {
    const order = await orderModel.findById(orderId);
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    if (status === "Đã giao thành công" && order.paymentMethod === "cod") {
      updateData.payment = true;
    }

    await orderModel.findByIdAndUpdate(orderId, {status});
  }
}

export default new OrderService();
