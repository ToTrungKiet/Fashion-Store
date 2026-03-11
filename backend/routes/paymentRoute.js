import express from "express";
import { createPayment, verifyPayment } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create-payment", auth.authUser, createPayment);
router.get("/verify-payment", verifyPayment);

export default router;