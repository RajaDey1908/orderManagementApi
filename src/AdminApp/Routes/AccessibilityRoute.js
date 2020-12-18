import express from 'express';
import upload from '../../../config/FileUpload';
import AccessibilityController from '../Controllers/AccessibilityController';
import authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/accessibility', authentication, upload.accessibilityImgUpload, AccessibilityController.createAccessibility);
router.get('/accessibility', authentication, AccessibilityController.listAccessibilitties);
router.get('/accessibility/:accessibilityId', AccessibilityController.listAccessibility);
router.put('/accessibility/:accessibilityId', authentication, upload.accessibilityImgUpload, AccessibilityController.updateAccessibility);
router.delete('/accessibility/:accessibilityId', authentication, AccessibilityController.deleteAccessibility);
export default router;