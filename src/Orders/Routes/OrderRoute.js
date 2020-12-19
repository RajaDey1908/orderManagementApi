import express from 'express';
import OrderController from '../Controllers/OrderController';
// intializing express router
const router = express.Router();

router.post('/order', OrderController.createOrder);
router.get('/topSaleProduct', OrderController.TopSaleProduct);
router.get('/saleRatio', OrderController.SaleRatio);
router.get('/currentProduct', OrderController.CurrentProduct);
export default router;