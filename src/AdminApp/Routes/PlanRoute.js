import express from 'express';
import PlanController from '../Controllers/PlanController';
import authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/plan', authentication, PlanController.createPlan);
router.get('/plan', authentication, PlanController.listPlans);
router.get('/plan/:planId', PlanController.listPlan);
router.put('/plan/:planId', authentication, PlanController.updatePlan);
router.delete('/plan/:planId', authentication, PlanController.deletePlan);
export default router;