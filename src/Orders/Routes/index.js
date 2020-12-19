import express from 'express';
// import user from './UserRoute';
// import car from './CarRoute';
// import setting from './SettingRoute';
// import exchange from './ExchangeRoute';
// import chat from './ChatRoute';
// import payment from './PaymentRoute';
// import feedback from './FeedbackRoute';
// import transaction from './TransactionRoute';
import order from './OrderRoute';
import product from './ProductRoute';

// intializing express router
const router = express.Router();
// intializing express with JSON
router.use(express.json())

// Routes starting with specific path...
// router.use('/user-api', user);
// router.use('/car-api', car);
// router.use('/setting-api', setting);
// router.use('/exchange-api', exchange);
// router.use('/chat-api', chat);
// router.use('/payment', payment);
// router.use('/feedback', feedback);
// router.use('/transaction', transaction);
router.use('/order', order);
router.use('/product', product);

export default router;
