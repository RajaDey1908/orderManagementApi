import express from 'express';
import SettingController from '../Controllers/SettingController';
import Authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/contactUs', SettingController.contactUs);
router.post('/mobile/otpSend', Authentication, SettingController.userMobileOTPSend);
router.post('/mobile/otpVerification', Authentication, SettingController.userMobileOTPVerification);
router.get('/language/list', Authentication, SettingController.listsLanguage);
export default router;