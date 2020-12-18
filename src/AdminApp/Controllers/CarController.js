import Car from '../../Models/Car';
import config from '../../../config/config';

/**
 * listsCar
 * Here fetch all cars
 * return JSON
 */
const listsCar = async(req, res) => {
    if(req.query.page == null){
        return res.status(400).send({msg:"Parameter missing..."})
    }
    try {
        let limit = 30;
        let page = req.query.page;
        var skip = (limit*page);
        const list = await Car.aggregate([
            {
                $match: {
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            }
        ])
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });
        const count = await Car.find({
            isDeleted: false
        }).countDocuments();
        const AllData = {
            'list': list,
            'count': count,
            'limit': limit
        };
        res.status(200).json({data: AllData});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listCar
 * Here fetch car details
 * return JSON
 */
const listCar = async(req, res) => {
    if(req.params.carId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    try {
        const car = await Car.findById({ 
            _id: req.params.carId 
        })
        .populate({
            path:'userId',
            model: 'user',
            select: 'name email address profilePicture'
        })
        .populate({
            path:'categoryId',
            model: 'category'
        });
        res.status(200).json({data:car});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * updateCar
 * Here update car
 * return JSON
 */
const updateCar = async(req, res) => {
    if(req.params.carId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        let allData = req.body;
        if(req.file) {
            allData.carImage = config.CAR_IMAGE_PATH + req.file.filename;
            const carData = await Car.findByIdAndUpdate(
                { _id: req.params.carId },
                {
                    $set: allData
                }
            );
        } else {
            if(allData.carImage) delete allData.carImage
            const carData = await Car.findByIdAndUpdate(
                { _id: req.params.carId },
                {
                    $set: allData
                }
            );
        }
        res.status(200).json({msg:"Car updated successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * deleteCar
 * Here delete car
 * return JSON
 */
const deleteCar = async(req, res) => {
    if(req.params.carId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const carData = await Car.findByIdAndUpdate(
            { _id: req.params.carId },
            {
                $set: {
                    isDeleted: true
                }
            });
        res.status(200).json({msg:"Car deleted successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

export default { listsCar, listCar, updateCar, deleteCar }