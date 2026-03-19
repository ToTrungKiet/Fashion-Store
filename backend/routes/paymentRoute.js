import express from "express";
import paymentController from '../controllers/paymentController.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/create-payment', auth.authUser, paymentController.createPayment);
router.get('/verify-payment', paymentController.verifyPayment);
router.post('/retry-payment', auth.authUser, paymentController.retryPayment);

export default router;