import express from 'express';
import order from './OrderRoute';
import product from './ProductRoute';

// intializing express router
const router = express.Router();
// intializing express with JSON
router.use(express.json())

router.use('/order', order);
router.use('/product', product);

export default router;
