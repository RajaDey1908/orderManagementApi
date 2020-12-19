import express from 'express';
import ProductController from '../Controllers/ProductController';
// intializing express router
const router = express.Router();

router.post('/product', ProductController.createProduct);
router.get('/productList', ProductController.listsProduct);
export default router;