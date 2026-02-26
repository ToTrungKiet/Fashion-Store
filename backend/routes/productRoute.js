import express from 'express'
import ProductController from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

const uploadFields = upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]);

productRouter.post('/add', adminAuth.authenticate, uploadFields, ProductController.addProduct)
productRouter.post('/update', adminAuth.authenticate, uploadFields, ProductController.updateProduct)
productRouter.post('/remove', adminAuth.authenticate, ProductController.removeProduct)
productRouter.post('/single', ProductController.singleProduct)
productRouter.get('/list', ProductController.listProducts)

export default productRouter;