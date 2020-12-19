import express from 'express';
import UserController from '../Controllers/UserController';
import Authentication from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.post('/user/login', UserController.userLogin);
router.post('/user/socialLogin', UserController.userSocialLogin);
router.post('/user', UserController.createUser);
router.post('/user/email/otpSend', UserController.emailOTPSend);
router.post('/user/emailVerification', UserController.signupEmailVerification);
router.post('/user/forgotPassword', UserController.forgotPassword);
router.post('/user/setPassword', UserController.setPassword);
router.get('/user/:userId', Authentication, UserController.getUserDetails);
router.put('/user/:userId', Authentication, UserController.updateUser);
router.put('/user/imageUpload/:userId', Authentication, upload.uploadUserImage, UserController.userImageUpload);
router.post('/favorite', Authentication, UserController.createFavourite);
router.get('/favorite', Authentication, UserController.myFavourite);
router.put('/user/traveller/:travellerId', Authentication, UserController.updateTraveller);
router.delete('/user/traveller/:travellerId', Authentication, UserController.deleteTraveller);
router.put('/user/destination/:destinationId', Authentication, UserController.updateDestination);
router.delete('/user/destination/:destinationId', Authentication, UserController.deleteDestination);
router.put('/changePassword', Authentication, UserController.changePassword);
router.put('/updateImage/:userId', Authentication, UserController.updateUserImage);


router.get('/test', UserController.test);
export default router;