import express from 'express'
import ProductController from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import auth from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

const uploadFields = upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]);

productRouter.post('/add',auth.authUser,adminAuth.authenticate, uploadFields, ProductController.addProduct)
productRouter.post('/update',auth.authUser,adminAuth.authenticate, uploadFields, ProductController.updateProduct)
productRouter.post('/remove',auth.authUser,adminAuth.authenticate, ProductController.removeProduct)
productRouter.post('/single', ProductController.singleProduct)
productRouter.get('/list', ProductController.listProducts)
productRouter.get('/inventory',auth.authUser,adminAuth.authenticate, ProductController.getInventory)
productRouter.post('/update-quantity',auth.authUser,adminAuth.authenticate, ProductController.updateProductQuantity)
productRouter.post('/restock',auth.authUser,adminAuth.authenticate, ProductController.restockProduct)
productRouter.get('/best-sellers',auth.authUser,adminAuth.authenticate, ProductController.getBestSellers)

export default productRouter;