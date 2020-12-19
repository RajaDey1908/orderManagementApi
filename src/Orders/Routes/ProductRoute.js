import express from 'express';
import ProductController from '../Controllers/ProductController';
import Authentication from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.post('/product', ProductController.createProduct);
router.get('/productList', ProductController.listsProduct);
router.get('/topSaleProduct', ProductController.TopSaleProduct);
router.get('/currentProduct', ProductController.CurrentProduct);
export default router;