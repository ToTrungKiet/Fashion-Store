import paymentService from "../services/paymentService.js";

class PaymentController {

  createPayment = async (req, res) => {
    try {
      const result = await paymentService.createPayment(
        req.user.id,
        req.body,
        req
      );

      return res.json({
        success: true,
        paymentUrl: result.paymentUrl,
        orderId: result.orderId,
      });

    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  verifyPayment = async (req, res) => {
    try {
      const success = await paymentService.verifyPayment(req.query);

      return res.json({
        success,
        message: success
          ? "Thanh toán thành công"
          : "Thanh toán thất bại"
      });

    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  retryPayment = async (req, res) => {
    try {
      const result = await paymentService.retryPayment(
        req.body.orderId,
        req
      );

      return res.json({
        success: true,
        paymentUrl: result.paymentUrl,
        orderId: result.orderId,
      });

    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };
}

export default new PaymentController();