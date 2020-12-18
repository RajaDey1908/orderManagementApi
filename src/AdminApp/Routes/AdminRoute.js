import express from 'express';
import upload from '../../../config/FileUpload';
import AdminController from '../Controllers/AdminController';
// intializing express router
const router = express.Router();

router.post('/adminLogin', AdminController.adminLogin);
router.get('/admin/:adminId',AdminController.getProfile);
router.put('/admin/:adminId',upload.uploadUserImage, AdminController.updateProfile);
router.post('/admin/forgotPassword', AdminController.forgotPassword);
router.post('/admin/setPassword', AdminController.setPassword);
router.put('/admin/change/password/:adminId', AdminController.changePassword);
router.get('/admin/dashboard/data/', AdminController.dashboard);
export default router;