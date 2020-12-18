import Accessibility from '../../Models/Accessibility';
import config from '../../../config/config';

/**
 * createAccessibility
 * Here add new accessibility
 * return JSON
 */
const createAccessibility = async(req, res) => {
    try {
        if(req.file){
            const addAccessibility = await new Accessibility({
                accessibilityTitle: req.body.accessibilityTitle,
                accessibilityImage: config.IMAGE_PATH + req.file.filename
            })
            .save();
            res.status(200).json({msg:"Accessibility has been added Successfully."});
        } else {
            const addAccessibility = await new Accessibility({
                accessibilityTitle: req.body.accessibilityTitle
            })
            .save();
            res.status(200).json({msg:"Accessibility has been added Successfully."});
        }
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listAccessibilitties
 * Here fetch all accessibility
 * return JSON
 */
const listAccessibilitties = async(req, res) => {
    try {
        const list = await Accessibility.find({
            isDeleted: false
        })
        res.status(200).json({data: list});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listAccessibility
 * Here fetch accessibility details
 * return JSON
 */
const listAccessibility = async(req, res) => {
    if(req.params.accessibilityId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const accessibility = await Accessibility.findById({
            _id: req.params.accessibilityId
        });
        res.status(200).json({data: accessibility});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * updateAccessibility
 * Here update accessibility details
 * return JSON
 */
const updateAccessibility = async(req, res) => {
    if(req.params.accessibilityId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        if(req.file){
            const update = await Accessibility.findByIdAndUpdate(
                { _id: req.params.accessibilityId },
                {
                    $set: {
                        accessibilityTitle: req.body.accessibilityTitle,
                        accessibilityImage: config.IMAGE_PATH + req.file.filename,
                        isActive: req.body.isActive
                    }
                }
            );
            res.status(200).json({msg:"Accessibility has been updated"});
        } else {
            const update = await Accessibility.findByIdAndUpdate(
                { _id: req.params.accessibilityId },
                {
                    $set: {
                        accessibilityTitle: req.body.accessibilityTitle,
                        isActive: req.body.isActive
                    }
                }
            );
            res.status(200).json({msg:"Accessibility has been updated"});
        } 
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * deleteAccessibility
 * Here delete accessibility details
 * return JSON
 */
const deleteAccessibility = async(req, res) => {
    if(req.params.accessibilityId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const accessibility = await Accessibility.findByIdAndUpdate(
            { _id: req.params.accessibilityId },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        res.status(200).json({msg: "accessibility has been deleted"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { createAccessibility, listAccessibilitties, listAccessibility, updateAccessibility, deleteAccessibility }