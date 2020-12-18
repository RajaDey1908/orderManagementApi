import multer from 'multer';
import config from '../config/config';

/*upload user profile picture*/
const userImageStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources" + config.USER_IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});
exports.uploadUserImage = multer({
    storage: userImageStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 10
    }
// }).single('profilePicture');
}).array('profilePicture',10);

/*upload category image*/
const categoryImgStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources" + config.CATEGORY_IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});
exports.categoryImgUpload = multer({
    storage: categoryImgStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 1
    }
}).single('categoryImage');

/*upload cms image*/
const cmsImgStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources" + config.IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
exports.cmsImage = multer({
    storage: cmsImgStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 1
    }
}).single('cmsImage');

/*upload amenity image*/
const amenityImgStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources" + config.IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
exports.amenityImgUpload = multer({
    storage: amenityImgStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 1
    }
}).single('amenityImage');

/*upload accessibility image*/
const accessibilityImgStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources" + config.IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
exports.accessibilityImgUpload = multer({
    storage: accessibilityImgStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 1
    }
}).single('accessibilityImage');

/*upload car image*/
const carImgStore = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources" + config.CAR_IMAGE_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
exports.carImgUpload = multer({
    storage: carImgStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 10
    }
    // }).single('carImage');
}).array('carImage', 10);
