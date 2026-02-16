import express from 'express'
import UserController from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/register', UserController.registerUser)
userRouter.post('/login', UserController.loginUser)
userRouter.post('/admin', UserController.adminLogin)

export default userRouter;
