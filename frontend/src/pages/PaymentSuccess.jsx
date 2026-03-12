import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, setCartItems } = useContext(ShopContext);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const query = location.search;
        const res = await axios.get(
          `${backendUrl}/api/payment/verify-payment${query}`
        );

        setResult(res.data);

        if (res.data.success) {
          setCartItems({});
        }
      } catch (error) {
        setResult({
          success: false,
          message: "Có lỗi xảy ra khi xác nhận thanh toán",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, backendUrl, setCartItems]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xl">
        Đang xác nhận thanh toán...
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white border rounded-xl shadow p-8 text-center">
        {result?.success ? (
          <>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Thanh toán thành công
            </h1>
            <p className="text-gray-700 mb-6">{result.message}</p>
            <button
              onClick={() => navigate("/orders")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Xem đơn hàng
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-700 mb-6">{result?.message}</p>
            <button
              onClick={() => navigate("/place-order")}
              className="bg-rose-500 text-white px-6 py-3 rounded-lg"
            >
              Quay lại đặt hàng
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;