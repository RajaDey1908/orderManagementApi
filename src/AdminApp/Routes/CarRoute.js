import express from 'express';
import CarController from '../Controllers/CarController';
import authentication from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.get('/car', authentication, CarController.listsCar);
router.get('/car/:carId', authentication, CarController.listCar);
router.put('/car/:carId', authentication, upload.carImgUpload, CarController.updateCar);
router.delete('/car/:carId', authentication, CarController.deleteCar);
export default router;