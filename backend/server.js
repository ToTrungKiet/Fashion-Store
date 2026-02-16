import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import database from './config/mongodb.js'
import cloudinaryService from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'

class Server {
    constructor () {
        this.app = express()
        this.port = process.env.PORT || 4000

        this.connectServices()
        this.configMiddleware()
        this.configRoutes()
    }

    connectServices() {
        database.connect()
        cloudinaryService.config()
    }

    configMiddleware() {
        this.app.use(express.json())
        this.app.use(cors())
    }

    configRoutes() {
        this.app.use('/api/user', userRouter)
        this.app.get('/', (req, res) => {
            res.json('API đang hoạt động !')
        })
    }
    
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server đang chạy ở http://localhost:${this.port}`);
        })
    }

}

const server = new Server()
server.start()
