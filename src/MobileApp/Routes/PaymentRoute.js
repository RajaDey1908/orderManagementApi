import express from 'express';
import PaymentController from '../Controllers/PaymentController'

// intializing express router

const router = express.Router();

// For Paypal
router.get('/paypal',  PaymentController.paypalHome);
router.get('/paypalAction',  PaymentController.paypalAction);
router.get('/success',  PaymentController.success);
router.get('/cancel',  PaymentController.cancel);

// For Alipay
router.get('/alipay',  PaymentController.alipay);
router.get('/alipayClient',  PaymentController.alipayClient);
router.get('/notify',  PaymentController.alipayNotify);
router.get('/return',  PaymentController.alipayReturn);

export default router;