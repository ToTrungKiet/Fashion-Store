import express from 'express'
import CartController from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/get', auth.authUser, CartController.getUserCart);
cartRouter.post('/add', auth.authUser, CartController.addToCart);
cartRouter.post('/update', auth.authUser,CartController.updateCart);

export default cartRouter;