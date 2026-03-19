import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import database from './config/mongodb.js'
import cloudinaryService from './config/cloudinary.js'

import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import paymentRouter from './routes/paymentRoute.js'

// init app
const app = express()
const PORT = process.env.PORT || 4000

// connect config
database.connect()
cloudinaryService.config()

// middleware
app.use(express.json())

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

// routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/payment', paymentRouter)

// test API
app.get('/', (req, res) => {
    res.json('API đang hoạt động !')
})

// start server
app.listen(PORT, () => {
    console.log(`Server đang chạy ở http://localhost:${PORT}`)
})