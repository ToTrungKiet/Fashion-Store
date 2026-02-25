import express from 'express'
import OrderController from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import auth from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/list', adminAuth.authenticate, OrderController.allOrders)
orderRouter.post('/status', adminAuth.authenticate, OrderController.updateStatus)

orderRouter.post('/place', auth.authUser, OrderController.placeOrder)
orderRouter.post('/momo', auth.authUser, OrderController.placeOrderMomo)
orderRouter.post('/zalopay', auth.authUser, OrderController.placeOrderZalopay)

orderRouter.post('/user-orders', auth.authUser, OrderController.userOrders)

export default orderRouter;
