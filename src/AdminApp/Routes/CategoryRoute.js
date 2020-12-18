import express from 'express';
import upload from '../../../config/FileUpload';
import CategoryController from '../Controllers/CategoryController';
import authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/category', authentication, upload.categoryImgUpload, CategoryController.createCategory);
router.get('/category', authentication, CategoryController.listCategories);
router.get('/category/:categoryId', CategoryController.listCategory);
router.put('/category', authentication, upload.categoryImgUpload, CategoryController.updateCategory);
router.delete('/category/:categoryId', authentication, CategoryController.deleteCategory);
export default router;