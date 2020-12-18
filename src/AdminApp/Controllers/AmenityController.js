import Amenity from '../../Models/Amenity';
import config from '../../../config/config';

/**
 * createAmenity
 * Here add new amenity
 * return JSON
 */
const createAmenity = async(req, res) => {
    try {
        if(req.file){
            const addAmenity = await new Amenity({
                amenityTitle: req.body.amenityTitle,
                amenityImage: config.IMAGE_PATH + req.file.filename
            })
            .save();
            res.status(200).json({msg:"Amenity has been added Successfully."});
        } else {
            const addAmenity = await new Amenity({
                amenityTitle: req.body.amenityTitle
            })
            .save();
            res.status(200).json({msg:"Amenity has been added Successfully."});
        }
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listAmenities
 * Here fetch all Amenity
 * return JSON
 */
const listAmenities = async(req, res) => {
    try {
        const list = await Amenity.find({
            isDeleted: false
        })
        res.status(200).json({data: list});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listAmenity
 * Here fetch amenity details
 * return JSON
 */
const listAmenity = async(req, res) => {
    if(req.params.amenityId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const amenity = await Amenity.findById({
            _id: req.params.amenityId
        });
        res.status(200).json({data: amenity});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * updateAmenity
 * Here update amenity details
 * return JSON
 */
const updateAmenity = async(req, res) => {
    if(req.params.amenityId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        if(req.file){
            const update = await Amenity.findByIdAndUpdate(
                { _id: req.params.amenityId },
                {
                    $set: {
                        amenityTitle: req.body.amenityTitle,
                        amenityImage: config.IMAGE_PATH + req.file.filename,
                        isActive: req.body.isActive
                    }
                }
            );
            res.status(200).json({msg:"Amenity has been updated"});
        } else {
            const update = await Amenity.findByIdAndUpdate(
                { _id: req.params.amenityId },
                {
                    $set: {
                        amenityTitle: req.body.amenityTitle,
                        isActive: req.body.isActive
                    }
                }
            );
            res.status(200).json({msg:"Amenity has been updated"});
        } 
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * deleteAmenity
 * Here delete amenity details
 * return JSON
 */
const deleteAmenity = async(req, res) => {
    if(req.params.amenityId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const amenity = await Amenity.findByIdAndUpdate(
            { _id: req.params.amenityId },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        res.status(200).json({msg: "Amenity has been deleted"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { createAmenity, listAmenities, listAmenity, updateAmenity, deleteAmenity }