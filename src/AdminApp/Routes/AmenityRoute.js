import express from 'express';
import upload from '../../../config/FileUpload';
import AmenityController from '../Controllers/AmenityController';
import authentication from '../../../middleware/isAuth';
// intializing express router
const router = express.Router();

router.post('/amenity', authentication, upload.amenityImgUpload, AmenityController.createAmenity);
router.get('/amenity', authentication, AmenityController.listAmenities);
router.get('/amenity/:amenityId', AmenityController.listAmenity);
router.put('/amenity/:amenityId', authentication, upload.amenityImgUpload, AmenityController.updateAmenity);
router.delete('/amenity/:amenityId', authentication, AmenityController.deleteAmenity);
export default router;