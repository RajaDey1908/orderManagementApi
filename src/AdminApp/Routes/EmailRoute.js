import express from 'express';
const router = express.Router();
import EmailTemplateController from '../Controllers/EmailTemplateController';

router.post('/email',EmailTemplateController.createTemplate);
router.put('/email/:emailId',EmailTemplateController.updateTemplate);
router.get('/email',EmailTemplateController.listTemplates);
router.get('/email/:emailId',EmailTemplateController.listTemplate);
router.delete('/email/:emailId',EmailTemplateController.deleteTemplate);
export default router;