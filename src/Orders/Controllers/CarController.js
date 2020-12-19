import Car from '../../Models/Car';
import Category from '../../Models/Category';
import User from '../../Models/User';
import Amenity from '../../Models/Amenity';
import Accessibility from '../../Models/Accessibility';
import Favorite from '../../Models/Favorite';
import config from '../../../config/config';
import nodemailer from '../../../config/nodemailer';
import mongoose from 'mongoose';
import Exchange from '../../Models/Exchange';



/**
 * createCar
 * @param req body
 * @returns JSON
 */
const createCar = async (req, res) => {
    // console.log("req.body-----", req.body)
    // console.log("req.file------", req.files)
    // return res.status(200).json({ msg: "data receive successfully" });
    // return
    if (req.body.title == null || req.body.model == null || req.body.seat == null || req.body.userId == null || req.body.categoryId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const allData = req.body;
        const carNumber = Math.floor(Math.random() * 999999) + 100000;
        // let amenityArr = JSON.parse(allData.amenity);
        let accessibilityArr = JSON.parse(allData.accessibility);
        let arrAmenity = [];
        let arrAccessibility = [];
        // if (amenityArr.length > 0) {
        //     for (let i = 0; i < amenityArr.length; i++) {
        //         const amenity = await Amenity.findById({ _id: amenityArr[i] });
        //         let obj = {
        //             amenityId: amenity._id,
        //             amenityTitle: amenity.amenityTitle,
        //             amenityImage: amenity.amenityImage
        //         };
        //         arrAmenity.push(obj);
        //     }
        //     allData.amenity = arrAmenity;
        // }
        if (accessibilityArr.length > 0) {
            for (let j = 0; j < accessibilityArr.length; j++) {
                const accessibility = await Accessibility.findById({ _id: accessibilityArr[j] });
                let obj = {
                    accessibilityId: accessibility._id,
                    accessibilityTitle: accessibility.accessibilityTitle,
                    accessibilityImage: accessibility.accessibilityImage
                };
                arrAccessibility.push(obj);
            }
            allData.accessibility = arrAccessibility;
        }
        allData.location = JSON.parse(allData.location);
        if (allData.carRegistrationId) {
            delete allData.carRegistrationId;
        }
        allData.carRegistrationId = carNumber;
        console.log('createCar allData ---------- ', allData)
        // return
        // if (req.file) {
        if (req.files.length > 0) {
            let filesAmount = req.files.length;
            let total_image = [];
            for (let i = 0; i < filesAmount; i++) {
                total_image.push({ image: config.CAR_IMAGE_PATH + req.files[i].filename });
            }
            allData.carImage = total_image;
            // allData.carImage = config.CAR_IMAGE_PATH + req.file.filename;
            const addCar = await new Car(allData).save();
        } else {
            const addCar = await new Car(allData).save();
        }
        res.status(200).json({ msg: "Car added successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * listsCar
 * @param req body
 * @returns json
 */
const listsCar = async (req, res) => {
    let userId = req.id;
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        let filterData = {
            isActive: true,
            isDeleted: false
        };
        // let limit = 70;
        // let limit = 5;
        // let page = req.query.page;
        // let skip = (limit * page);
        const cars = await Car.aggregate([
            {
                $match: filterData
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $sort: { createdDate: -1 } },
            { $limit: 5 },
        ])
            // .skip(skip)
            // .limit(limit)
            // .sort({ createdDate: 'DESC' });
            // .sort({ createdDate: 'ASC' });
        for (let i = 0; i < cars.length; i++) {
            const favorite = await Favorite.find({
                carId: cars[i]._id,
                userId: userId
            });
            cars[i]['isFav'] = favorite.length > 0 ? favorite[0].isActive : false;
        }
        res.status(200).json({ data: cars });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * listCar
 * @param req body
 * @returns json
 */
const listCar = async (req, res) => {
    let userId = req.id;
    if (req.params.carId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        const car = await Car.findById({
            _id: req.params.carId
        })
            .populate({
                path: 'userId',
                model: 'user',
                select: 'name email address profilePicture'
            })
            .populate({
                path: 'categoryId',
                model: 'category'
            });
        const favorite = await Favorite.find({
            carId: req.params.carId,
            userId: userId
        });
        const result = {
            car: car,
            isFav: favorite.length > 0 ? favorite[0].isActive : false
        }
        res.status(200).json({ data: result });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * categoryList
 * @param req body
 * @returns json
 */
const categoryList = async (req, res) => {
    try {
        const category = await Category.find({ isActive: true, isDeleted: false });
        res.status(200).json({ data: category });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * amenityList
 * @param req body
 * @returns json
 */
const amenityList = async (req, res) => {
    try {
        const amenity = await Amenity.find({ isActive: true, isDeleted: false });
        res.status(200).json({ data: amenity });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * accessibilityList
 * @param req body
 * @returns json
 */
const accessibilityList = async (req, res) => {
    try {
        const accessibility = await Accessibility.find({ isActive: true, isDeleted: false });
        res.status(200).json({ data: accessibility });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * myCars
 * @param req body
 * @returns json
 */
const myCars = async (req, res) => {
    let userId = req.id;
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        let filterData = {
            isActive: true,
            isDeleted: false,
            userId: mongoose.Types.ObjectId(userId)
        };
        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);
        const cars = await Car.aggregate([
            {
                $match: filterData
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'cateDetails'
                }
            }
        ])
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'desc' });
        res.status(200).json({ data: cars });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * updateCar
 * @param req body
 * @returns JSON
 */
const updateCar = async (req, res) => {
    if (req.params.carId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const allData = req.body;
        if (allData.amenity) {
            // let amenityArr = JSON.parse(allData.amenity);
            // let arrAmenity = [];
            // if (amenityArr.length > 0) {
            //     for (let i = 0; i < amenityArr.length; i++) {
            //         const amenity = await Amenity.findById({ _id: amenityArr[i] });
            //         let obj = {
            //             amenityId: amenity._id,
            //             amenityTitle: amenity.amenityTitle,
            //             amenityImage: amenity.amenityImage
            //         };
            //         arrAmenity.push(obj);
            //     }
            //     allData.amenity = arrAmenity;
            // }
        }
        if (allData.accessibility) {
            let accessibilityArr = JSON.parse(allData.accessibility);
            let arrAccessibility = [];
            if (accessibilityArr.length > 0) {
                for (let j = 0; j < accessibilityArr.length; j++) {
                    const accessibility = await Accessibility.findById({ _id: accessibilityArr[j] });
                    let obj = {
                        accessibilityId: accessibility._id,
                        accessibilityTitle: accessibility.accessibilityTitle,
                        accessibilityImage: accessibility.accessibilityImage
                    };
                    arrAccessibility.push(obj);
                }
                allData.accessibility = arrAccessibility;
            }
        }
        if (allData.location) {
            allData.location = JSON.parse(allData.location);
        }
        if (allData.carRegistrationId) {
            delete allData.carRegistrationId;
        }
        console.log('allData ===> ', allData)
        // if (req.file) {
        if (req.files.length > 0) {
            let filesAmount = req.files.length;
            let total_image = [];
            for (let i = 0; i < filesAmount; i++) {
                total_image.push({ image: config.CAR_IMAGE_PATH + req.files[i].filename });
            }

            let oldCarImages = [];
            const carDetails = await Car.find({
                _id: req.params.carId,
            });
            if (carDetails.length > 0) {
                if (JSON.stringify(carDetails[0].carImage.length > 0)) {
                    oldCarImages = JSON.parse(JSON.stringify(carDetails[0].carImage))
                }
            }

            // allData.carImage = total_image.concat(oldCarImages) ;
            allData.carImage = oldCarImages.concat(total_image);
            // console.log("allData.carImage", allData.carImage)
            // allData.carImage = config.CAR_IMAGE_PATH + req.file.filename;
            const updateCar = await Car.findByIdAndUpdate(
                { _id: req.params.carId },
                {
                    $set: allData
                }
            );
        } else {
            const updateCar = await Car.findByIdAndUpdate(
                { _id: req.params.carId },
                {
                    $set: allData
                }
            );
        }
        res.status(200).json({ msg: "Car updated successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * updateCarImage
 * @param req body
 * @returns JSON
 */
const updateCarImage = async (req, res) => {
    if (req.params.carId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const allData = req.body;
        // console.log('allData ===> ', allData)
        const carDetails = await Car.find({
            _id: req.params.carId,
        });
        if (carDetails.length > 0) {
            if (JSON.stringify(carDetails[0].carImage.length > 0)) {

                let oldCarImages = JSON.parse(JSON.stringify(carDetails[0].carImage))
                let oldImageRemoveId = JSON.parse(allData.oldImageRemoveId)
                let filteredImages = []
                for (let i = 0; i < oldImageRemoveId.length; i++) {
                    filteredImages = oldCarImages.filter(function (el) { return el._id != oldImageRemoveId[i]; });
                }

                let updateData = {
                    carImage: filteredImages
                }
                const updateCar = await Car.findByIdAndUpdate(
                    { _id: req.params.carId },
                    {
                        $set: updateData
                    }
                );

                // let filteredImages = oldCarImages.filter(function (el) { return el._id != allData.imageId; });
                // let updateData = {
                //     carImage: filteredImages
                // }
                // const updateCar = await Car.findByIdAndUpdate(
                //     { _id: req.params.carId },
                //     {
                //         $set: updateData
                //     }
                // );
                res.status(200).json({ msg: "Car Image updated successfully" });

            } else {
                res.status(201).json({ msg: "Image not Found" });
            }


        } else {
            res.status(201).json({ msg: "Car not Found" });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * searchCar
 * @param req body
 * @returns json
 */
const searchCar = async (req, res) => {
    let userId = req.id;
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        let filterData = {
            isActive: true,
            isDeleted: false
        };
        if (req.query.seat) {
            filterData.seat = parseInt(req.query.seat);
        }
        if (req.query.fromDate && req.query.fromDate) {
            filterData.startDate = {
                $lt: req.query.fromDate,
                $lt: req.query.tillDate
            }
            filterData.endDate = {
                $gte: req.query.fromDate,
                $gte: req.query.tillDate
            }
        }

        console.log("formdata", req.query)
        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);

        let cars = []

        // req.query.locationLong =""
        // req.query.locationLatt=""

        if (req.query.locationLong && req.query.locationLatt) {
            cars = await Car.aggregate([

                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: [parseFloat(req.query.locationLong), parseFloat(req.query.locationLatt)] },
                        distanceField: "dist.calculated",
                        maxDistance: 1000,
                        spherical: true
                    }
                },
                {
                    $match: filterData
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                }
            ])
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'desc' });
        } else {
            cars = await Car.aggregate([
                {
                    $match: filterData
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                }
            ])
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'desc' });
        }

        console.log("carsData----------", cars)

        for (let i = 0; i < cars.length; i++) {
            const favorite = await Favorite.find({
                carId: cars[i]._id,
                userId: userId
            });
            cars[i]['isFav'] = favorite.length > 0 ? favorite[0].isActive : false;
        }
        res.status(200).json({ data: cars });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * nearbyCarList
 * @param req body
 * @returns json
 */
const nearbyCarList = async (req, res) => {
    let userId = req.id;
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        let filterData = {
            isActive: true,
            isDeleted: false,
            userId: { $ne: mongoose.Types.ObjectId(userId) }
        };
        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);
        const cars = await Car.aggregate([
            {
                $match: filterData
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            }
        ])
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'DESC' });
        for (let i = 0; i < cars.length; i++) {
            const favorite = await Favorite.find({
                carId: cars[i]._id,
                userId: userId
            });
            cars[i]['isFav'] = favorite.length > 0 ? favorite[0].isActive : false;
        }
        res.status(200).json({ data: cars });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * filterCarList
 * @param req body
 * @returns json
 */
const filterCarList = async (req, res) => {
    console.log("req.body-----filterCarList-----", req.body)

    let userId = req.id;
    if (req.body.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        let cars = [];
        let limit = 100;
        let page = req.query.page;
        let skip = (limit * page);

        if ((req.body.categoryId.length > 0) && (req.body.amenityId.length > 0) && (req.body.accessibilityId.length > 0)) {
            console.log("--------------111")

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "categoryId": req.body.categoryId,
                "amenity.amenityId": req.body.amenityId,
                "accessibility.accessibilityId": req.body.accessibilityId
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }
            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });
        }




        else if ((req.body.categoryId.length > 0) && (req.body.amenityId.length < 1) && (req.body.accessibilityId.length < 1)) {
            console.log("-----------100")

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "categoryId": req.body.categoryId,
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }
            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });

        } else if ((req.body.categoryId.length > 0) && (req.body.amenityId.length > 0) && (req.body.accessibilityId.length < 1)) {
            console.log("----------110")

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "amenity.amenityId": req.body.amenityId,
                "categoryId": req.body.categoryId,
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }
            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });

        } else if ((req.body.categoryId.length > 0) && (req.body.amenityId.length < 1) && (req.body.accessibilityId.length > 0)) {
            console.log("---------101")

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "categoryId": req.body.categoryId,
                "accessibility.accessibilityId": req.body.accessibilityId
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }

            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });

        }





        else if ((req.body.categoryId.length < 1) && (req.body.amenityId.length > 0) && (req.body.accessibilityId.length < 1)) {
            console.log("--------010")

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "amenity.amenityId": req.body.amenityId
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }
            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });


        } else if ((req.body.categoryId.length > 0) && (req.body.amenityId.length > 0) && (req.body.accessibilityId.length < 1)) {

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "categoryId": req.body.categoryId,
                "amenity.amenityId": req.body.amenityId
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }
            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });
            console.log("----------110")
        } else if ((req.body.categoryId.length < 1) && (req.body.amenityId.length > 0) && (req.body.accessibilityId.length > 0)) {
            console.log("-----------------011")


            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "accessibility.accessibilityId": req.body.accessibilityId,
                "amenity.amenityId": req.body.amenityId
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }
            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });

        }





        else if ((req.body.categoryId.length < 1) && (req.body.amenityId.length < 1) && (req.body.accessibilityId.length > 0)) {

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "accessibility.accessibilityId": req.body.accessibilityId,
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }
            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });

            console.log("-----------------001")


        } else if ((req.body.categoryId.length > 0) && (req.body.amenityId.length < 1) && (req.body.accessibilityId.length > 0)) {
            console.log("---------101")

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "accessibility.accessibilityId": req.body.accessibilityId,
                "categoryId": req.body.categoryId
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }
            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });

        } else if ((req.body.categoryId.length < 1) && (req.body.amenityId.length > 0) && (req.body.accessibilityId.length > 0)) {
            console.log("------------011")

            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
                "accessibility.accessibilityId": req.body.accessibilityId,
                "amenity.amenityId": req.body.amenityId
            }
            // if (req.body.long && req.body.lat) {
            //     filterData = {
            //         location:
            //         {
            //             $near:
            //             {
            //                 $geometry: {
            //                     type: "Point",
            //                     coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //                 },
            //                 $maxDistance: 1000
            //             }
            //         }
            //     }
            // }

            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });
        }



        else {
            console.log("-----------000")
            let filterData = {
                "isActive": true,
                "isDeleted": false,
                "isAdminVerified": true,
            }
            // if (req.body.long && req.body.lat) {
            // console.log("in function-------")
            // filterData = {
            //     $or: [                        
            //         { locationName: { '$regex': req.body.province, '$options': 'i' } },
            //         { province: { '$regex': req.body.province, '$options': 'i' } }
            //     ]
            // }

            // filterData = {
            //     location:
            //     {
            //         $near:
            //         {
            //             $geometry: {
            //                 type: "Point",
            //                 coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)]
            //             },
            //             $maxDistance: 1000
            //         }
            //     }
            // }
            // }

            if (req.body.seat) {
                filterData.seat = parseInt(req.body.seat);
            }
            if (req.body.fromDate && req.body.fromDate) {
                filterData.startDate = {
                    $lt: req.body.fromDate,
                    $lt: req.body.tillDate
                }
                filterData.endDate = {
                    $gte: req.body.fromDate,
                    $gte: req.body.tillDate
                }
            }

            if (req.body.province) {
                filterData = {
                    $or: [
                        { locationName: req.body.province },
                        { province: req.body.province }
                    ]
                }
            }

            cars = await Car.find(filterData).populate({
                path: 'userId',
                model: 'user',
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdDate: 'DESC' });
        }

        console.log("cars---", cars)

        let removeItemId = [];
        for (let i = 0; i < cars.length; i++) {

            let flag = false

            if (req.body.exchangeType != '' || req.body.drivingType != '') {

                let tempFilterData = {
                    carId: mongoose.Types.ObjectId(cars[i]._id),
                }
                if (req.body.exchangeType != '') {
                    tempFilterData.exchangeType = req.body.exchangeType
                }
                if (req.body.drivingType != '') {
                    tempFilterData.drivingType = req.body.drivingType
                }

                let ExchangeDetails = await Exchange.find(tempFilterData);

                if (ExchangeDetails.length < 1) {
                    removeItemId.push(cars[i]._id)
                }

            }


            if (req.body.group.length > 0) {

                cars[i] && cars[i].userId && cars[i].userId.group && cars[i].userId.group && cars[i].userId.group.length > 0 && cars[i].userId.group.forEach(function (entry) {
                    if (req.body.group.includes(entry.name)) {
                        flag = true;
                    }
                });
                if (!flag) {
                    removeItemId.push(cars[i]._id)
                    removeItemId.push(cars[i]._id)
                    // JSON.parse(JSON.stringify(cars)).splice(i, 1)
                }

            }
        }

        removeItemId = removeItemId.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) == index;
        });

        removeItemId.forEach(function (entry) {
            // tempCar = tempCar.filter(person => person._id != entry);
            cars = cars.filter(person => person._id != entry);

        });
        // console.log("cars Details", cars[0])
        console.log("cars length", cars.length)

        res.status(200).json({ data: cars });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}



/**
 * demandCar
 * @param req body
 * @returns json
 */
const demandCar = async (req, res) => {
    let userId = req.id;
    // console.log("userId------------", userId)
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        let filterData = {
            isActive: true,
            isDeleted: false,
            carUserId: mongoose.Types.ObjectId(userId),
            // isFav: true
        };
        let limit = 70;
        let page = req.query.page;
        let skip = (limit * page);
        const cars = await Favorite.aggregate([
            {
                $match: filterData
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'sendUserDetails'
                }
            },
            // {
            //     $lookup: {
            //         from: 'users',
            //         localField: 'carUserId',
            //         foreignField: '_id',
            //         as: 'userDetails'
            //     }
            // },
            // {
            //     $lookup: {
            //         from: 'cars',
            //         localField: 'carId',
            //         foreignField: '_id',
            //         as: 'carDetails'
            //     }
            // }
        ])
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'DESC' });
        // console.log("list", list)
        let allCars = []
        if (cars.length > 0) {
            for (let j = 0; j < cars.length; j++) {

                let carDetails = []

                if (cars[j].userId) {
                    let userFilterData = {
                        userId: mongoose.Types.ObjectId(cars[j].userId),
                    }
                    carDetails = await Car.find(userFilterData);
                }
                console.log("carDetails--", carDetails)
                if (carDetails.length > 0) {
                    let carObject = JSON.parse(JSON.stringify(cars[j]));
                    carObject.userProfilePicture = cars[j].sendUserDetails[0].profilePicture
                    carObject.carDetails = JSON.stringify(carDetails)
                    allCars.push(carObject)

                }

            }
        }

        res.status(200).json({ data: allCars });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}



/**
 * filterCarByUserList
 * @param req body
 * @returns json
 */
const filterCarByUserList = async (req, res) => {
    // console.log("filterCarByUserList-------------")
    // console.log("filterCarByUserList----req.bodJSON.parse(JSON.stringify(cars[j])y---------", req.body)
    let userId = req.id;
    if (req.body.page == null || req.body.textSearch == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {

        let limit = 100;
        let page = req.query.page;
        let skip = (limit * page);

        let carFilterData = {
            "isActive": true,
            "isDeleted": false,
            "isAdminVerified": true,
        }

        carFilterData = {
            $or: [
                { locationName: { '$regex': req.body.province, '$options': 'i' } },
                { province: { '$regex': req.body.province, '$options': 'i' } },
                { title: { '$regex': req.body.province, '$options': 'i' } },
                { brand: { '$regex': req.body.province, '$options': 'i' } },
                { model: { '$regex': req.body.province, '$options': 'i' } }
            ]
        }

        let cars = await Car.find(carFilterData).populate({
            path: 'userId',
            model: 'user',
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'DESC' });


        let allCars = []
        if (cars.length > 0) {
            for (let j = 0; j < cars.length; j++) {

                let ExchangeDetails = []

                if (cars[j]._id) {
                    let exchangeFilterData = {
                        carId: mongoose.Types.ObjectId(cars[j]._id),
                    }
                    ExchangeDetails = await Exchange.find(exchangeFilterData);
                }

                let carObject = JSON.parse(JSON.stringify(cars[j]));

                carObject.userProfilePicture = cars[j].userId.profilePicture
                carObject.ownerName = cars[j].userId.name
                carObject.userIsEmailVerified = cars[j].userId.isEmailVerified
                carObject.userIsPhoneVerified = cars[j].userId.isPhoneVerified
                carObject.userIsGovtIdVerified = cars[j].userId.isGovtIdVerified
                carObject.userIsDrivingLicenceVerified = cars[j].userId.isDrivingLicenceVerified
                carObject.group = JSON.stringify(cars[j].userId.group)
                carObject.traveller = JSON.stringify(cars[j].userId.traveller)
                carObject.ExchangeDetails = JSON.stringify(ExchangeDetails)

                allCars.push(carObject)
            }
        }

        // console.log("allCars----", allCars[0])
        // console.log("allCars-length---", allCars.length)




        let filterData = {
            isActive: true,
            isDeleted: false,
            name: { '$regex': req.body.textSearch, '$options': 'i' }
        };
        const users = await User.aggregate([
            {
                $match: filterData
            },
        ])
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'DESC' });

        let userCars = []

        for (let i = 0; i < users.length; i++) {
            const carDetails = await Car.find({
                userId: users[i]._id,
            });

            if (carDetails.length > 0) {
                carDetails.forEach(async element => {

                    let ExchangeDetails = []

                    if (element._id) {
                        let tempFilterData = {
                            // carId: mongoose.Types.ObjectId(carDetails[i]._id),
                            carId: mongoose.Types.ObjectId(element._id),
                        }
                        ExchangeDetails = await Exchange.find(tempFilterData);
                    }

                    let carObject = JSON.parse(JSON.stringify(element));

                    carObject.userProfilePicture = users[i].profilePicture
                    carObject.ownerName = users[i].name
                    carObject.userIsEmailVerified = users[i].isEmailVerified
                    carObject.userIsPhoneVerified = users[i].isPhoneVerified
                    carObject.userIsGovtIdVerified = users[i].isGovtIdVerified
                    carObject.userIsDrivingLicenceVerified = users[i].isDrivingLicenceVerified
                    carObject.group = JSON.stringify(users[i].group)
                    carObject.traveller = JSON.stringify(users[i].traveller)
                    carObject.ExchangeDetails = JSON.stringify(ExchangeDetails)
                    userCars.push(carObject)
                });
            }
        }

        let totalCars = allCars.concat(userCars);
        let finalCars = totalCars.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i)

        res.status(200).json({ data: finalCars });

    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

export default { createCar, listsCar, listCar, categoryList, amenityList, accessibilityList, myCars, updateCar, searchCar, nearbyCarList, filterCarList, demandCar, filterCarByUserList, updateCarImage }