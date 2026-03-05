import express from 'express'
import UserController from '../controllers/userController.js'
import auth from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/register', UserController.registerUser)
userRouter.post('/login', UserController.loginUser)
userRouter.post('/admin', UserController.adminLogin)

userRouter.post("/profile",auth.authUser,UserController.getProfile)
userRouter.post("/update-profile", auth.authUser, UserController.updateProfile)

export default userRouter