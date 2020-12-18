import express from 'express';
import CarController from '../Controllers/CarController';
import Authentication from '../../../middleware/isAuth';
import upload from '../../../config/FileUpload';
// intializing express router
const router = express.Router();

router.post('/car', Authentication, upload.carImgUpload, CarController.createCar);
router.put('/car/:carId', Authentication, upload.carImgUpload, CarController.updateCar);
router.put('/carImage/:carId', Authentication, CarController.updateCarImage);
router.get('/car', Authentication, CarController.listsCar);
router.get('/demand', Authentication, CarController.demandCar);
router.get('/myCar', Authentication, CarController.myCars);
router.get('/car/:carId', Authentication, CarController.listCar);
router.get('/category', Authentication, CarController.categoryList);
router.get('/amenity', Authentication, CarController.amenityList);
router.get('/accessibility', Authentication, CarController.accessibilityList);
router.get('/filter', Authentication, CarController.searchCar);
router.get('/nearby/carList', Authentication, CarController.nearbyCarList);
router.post('/filter/withType', Authentication, CarController.filterCarList);
router.post('/filter/text', Authentication, CarController.filterCarByUserList);
export default router;