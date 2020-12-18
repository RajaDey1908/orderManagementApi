import express from 'express';
import ExchangeController from '../Controllers/ExchangeController';
import Authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.get('/exchange', Authentication, ExchangeController.listsExchangeRequest);
router.get('/exchange/:exchangeId', Authentication, ExchangeController.listExchangeRequest);
router.put('/exchange/:exchangeId', Authentication, ExchangeController.updateExchangeRequest);
export default router;