import express from 'express'
import UserController from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post('/register', UserController.registerUser)
userRouter.post('/login', UserController.loginUser)
userRouter.post('/admin', UserController.adminLogin)

// route profile
userRouter.post("/profile", UserController.getProfile)

userRouter.post("/update-profile", UserController.updateProfile)

export default userRouter;