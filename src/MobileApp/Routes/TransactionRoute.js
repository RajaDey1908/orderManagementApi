import express from 'express';
import TransactionController from '../Controllers/TransactionController'
import Authorization from '../../../middleware/isAuth';

// intializing express router
const router = express.Router();
router.post('/transaction', Authorization, TransactionController.TranscationCreate);

export default router;