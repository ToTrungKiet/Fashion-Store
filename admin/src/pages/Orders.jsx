import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency, formatPrice } from "../App.jsx";
import { assets } from "../assets/assets.js";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Cập nhật trạng thái thành công");
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Đơn hàng đã đặt":
        return "bg-gray-100 text-gray-700";
      case "Đang đóng gói":
        return "bg-yellow-100 text-yellow-700";
      case "Đã gửi hàng":
        return "bg-blue-100 text-blue-700";
      case "Đang giao hàng":
        return "bg-purple-100 text-purple-700";
      case "Đã giao thành công":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Quản lý đơn hàng
      </h3>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-1 
              lg:grid-cols-[80px_2fr_1.2fr_1fr_1fr] 
              gap-5 items-start 
              bg-white shadow-sm hover:shadow-md 
              transition-all duration-300 
              rounded-xl p-6 border border-gray-100"
            >
              {/* Icon */}
              <img
                className="w-14 h-14"
                src={assets.parcel_icon}
                alt="parcel"
              />

              {/* Thông tin sản phẩm + khách */}
              <div>
                <div className="text-sm text-gray-700">
                  {order.items.map((item, index) => (
                    <p key={index} className="py-1">
                      {item.name} x {item.quantity}
                      <span className="ml-1 text-gray-500">
                        ({item.size})
                      </span>
                      {index !== order.items.length - 1 && ","}
                    </p>
                  ))}
                </div>

                <p className="mt-3 mb-2 font-semibold text-gray-800 text-base">
                  {order.address.firstName} {order.address.lastName}
                </p>

                <p className="text-gray-500 leading-relaxed">
                  {order.address.address}, {order.address.ward},{" "}
                  {order.address.district}, {order.address.city}
                </p>

                <p className="text-gray-600 mt-1">
                  {order.address.phone}
                </p>
              </div>

              {/* Thông tin thanh toán */}
              <div className="text-gray-600 space-y-2 text-sm">
                <p className="font-medium">Số sản phẩm: {order.items.length}</p>

                <p>Phương thức: {order.paymentMethod}</p>

                <p>Thanh toán:
                  <span className={`ml-2 font-semibold ${order.payment ? "text-green-600" : "text-red-500"}`}>
                    {order.payment ? "Đã thanh toán" : "Chưa thanh toán"}
                  </span>
                </p>

                <p>Ngày:{" "}{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
  
              </div>

              {/* Tổng tiền */}
              <div className="flex flex-col justify-between">
                <p className="text-lg font-bold text-indigo-600">
                  {formatPrice(order.amount)} {currency}
                </p>

                <span
                  className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Select đổi trạng thái */}
              <div>
                <select
                  onChange={(e) =>
                    statusHandler(e, order._id)
                  }
                  value={order.status}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 
                  focus:ring-2 focus:ring-indigo-400 
                  focus:outline-none 
                  text-sm font-medium bg-white cursor-pointer"
                >
                  <option value="Đơn hàng đã đặt">
                    Đơn hàng đã đặt
                  </option>
                  <option value="Đang đóng gói">
                    Đang đóng gói
                  </option>
                  <option value="Đã gửi hàng">
                    Đã gửi hàng
                  </option>
                  <option value="Đang giao hàng">
                    Đang giao hàng
                  </option>
                  <option value="Đã giao thành công">
                    Đã giao thành công
                  </option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;