import express from 'express'
import OrderController from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import auth from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/list',auth.authUser,adminAuth.authenticate, OrderController.allOrders)
orderRouter.post('/status',auth.authUser,adminAuth.authenticate, OrderController.updateStatus)

orderRouter.post('/place', auth.authUser, OrderController.placeOrder)

orderRouter.post('/VNPay', auth.authUser, OrderController.placeOrderVNPay)

orderRouter.post('/user-orders', auth.authUser, OrderController.userOrders)

export default orderRouter;
