import express from 'express';
const router = express.Router();
import LanguageController from '../Controllers/LanguageController';
import Authentication from '../../../middleware/isAuth';

router.post('/language', Authentication, LanguageController.createLanguage);
router.get('/language', Authentication, LanguageController.listsLanguage);
router.get('/language/:languageId', Authentication, LanguageController.listLanguage);
router.put('/language/:languageId', Authentication, LanguageController.updateLanguage);
router.delete('/language/:languageId', Authentication, LanguageController.deleteLanguage);
export default router;