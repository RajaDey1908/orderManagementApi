import Cms from '../../Models/Cms';
import config from '../../../config/config';

/**
 * createCms
 * Here admin add new cms page
 * return JSON
 */
const createCms = async(req, res) => {
    try {
        const titleExist = await Cms.find({ cmsTitle: req.body.cmsTitle });
        console.log(titleExist)
        if(titleExist.length > 0){
            res.status(400).json({ msg:"Title already exist" });
        } else {
            const slug = createSlug(req.body.cmsTitle);
            if(slug) {
                const add = await new Cms({
                    cmsTitle: req.body.cmsTitle,
                    cmsSlug: slug,
                    cmsContent: req.body.cmsContent
                })
                .save();
            }
            res.status(200).json({msg:"Cms page added successfully"})
        }
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listAllCms
 * Here fetch all cms pages
 * return JSON
 */
const listAllCms = async(req, res) => {
    try {
        const allCms = await Cms.find({ isDeleted: false });
        res.status(200).json({data:allCms});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listCms
 * Here fetch all cms pages
 * return JSON
 */
const listCms = async(req, res) => {
    if(req.params.cmsId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    try {
        const cmsData = await Cms.findById({ _id: req.params.cmsId });
        res.status(200).json({data:cmsData});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * updateCms
 * Here update cms page
 * return JSON
 */
const updateCms = async(req, res) => {
    if(req.params.cmsId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const cmsData = await Cms.findByIdAndUpdate(
            { _id: req.params.cmsId },
            {
                $set: {
                    cmsTitle: req.body.cmsTitle,
                    cmsContent: req.body.cmsContent
                }
            });
        res.status(200).json({msg:"Cms updated successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * deleteCms
 * Here delete cms page
 * return JSON
 */
const deleteCms = async(req, res) => {
    if(req.params.cmsId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const cmsData = await Cms.findByIdAndUpdate(
            { _id: req.params.cmsId },
            {
                $set: {
                    isDeleted: true
                }
            });
        res.status(200).json({msg:"Cms deleted successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * uploadImage
 * Here delete cms page
 * return JSON
 */
const uploadImage = async(req, res) => {
    if(req.file) {
        res.status(200).json({data:config.BASE_URL + config.IMAGE_PATH + req.file.filename});
    }else{
        res.status(400).json({msg:"Image missing..."})
    }
}

const createSlug = (title) => {
    let slug = title.toString().toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
    return slug;
}

export default { createCms, listAllCms, listCms, updateCms, deleteCms, uploadImage }