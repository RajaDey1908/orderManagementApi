import express from 'express';
import ExchangeController from '../Controllers/ExchangeController';
import Authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/exchange/request', Authentication, ExchangeController.createExchange);
router.post('/exchange/onlyMessage', Authentication, ExchangeController.onlyMessage);
router.post('/exchange/sendInterest', Authentication, ExchangeController.sendInterest);
router.get('/exchange/request', Authentication, ExchangeController.listsExchangeRequest);
router.get('/exchange/request/:exchangeId', Authentication, ExchangeController.listExchangeRequest);
router.post('/send/exchangeRequest', Authentication, ExchangeController.sendExchangeRequest);
router.post('/send/pastExchangeRequest', Authentication, ExchangeController.sendPastExchangeRequest);

router.put('/exchange/:exchangeId', Authentication, ExchangeController.updateExchange);
router.put('/exchange/finalised/:exchangeId', Authentication, ExchangeController.finalisedExchange);
router.put('/exchange/actualExchange/:exchangeId', Authentication, ExchangeController.actualExchange);
router.post('/exchange/exchangeCarList', Authentication, ExchangeController.exchangeCarList);
router.get('/exchange/exchangeBetween/:partnerId', Authentication, ExchangeController.listExchangeBetween);
router.get('/exchange/CheckActiveExchange/:partnerId', Authentication, ExchangeController.CheckActiveExchange);




export default router;