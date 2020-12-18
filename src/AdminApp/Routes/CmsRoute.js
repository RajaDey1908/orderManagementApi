import express from 'express';
const router = express.Router();
import CmsController from '../Controllers/CmsController';
import upload from '../../../config/FileUpload';

router.post('/cms',CmsController.createCms);
router.post('/cms/image', upload.cmsImage, CmsController.uploadImage);
router.get('/cms',CmsController.listAllCms);
router.get('/cms/:cmsId',CmsController.listCms);
router.put('/cms/:cmsId',CmsController.updateCms);
router.delete('/cms/:cmsId',CmsController.deleteCms);
export default router;