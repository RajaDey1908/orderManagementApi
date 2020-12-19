import express from 'express';
import OrderController from '../Controllers/OrderController';
// intializing express router
const router = express.Router();

router.post('/order', OrderController.createOrder);
// router.get('/productList', ProductController.listsProduct);
router.get('/topSaleProduct', OrderController.TopSaleProduct);
// router.get('/currentProduct', ProductController.CurrentProduct);
export default router;