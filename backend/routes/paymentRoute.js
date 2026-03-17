import express from "express";
import paymentController from '../controllers/paymentController.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/create-payment', auth.authUser, paymentController.createPayment.bind(paymentController));
router.get('/verify-payment', paymentController.verifyPayment.bind(paymentController));
router.post('/retry-payment', auth.authUser, paymentController.retryPayment.bind(paymentController));

export default router;