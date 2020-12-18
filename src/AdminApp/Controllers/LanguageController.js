import Language from '../../Models/Language';

/**
 * createLanguage
 * Here admin add new Language
 * return JSON
 */
const createLanguage = async(req, res) => {
    try {
        const titleExist = await Language.find({ name: req.body.name });
        console.log(titleExist)
        if(titleExist.length > 0){
            res.status(400).json({ msg:"Language already exist" });
        } else {
            const add = await new Language(req.body)
            .save();
            res.status(200).json({msg:"Language added successfully"})
        }
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listsLanguage
 * Here fetch all language
 * return JSON
 */
const listsLanguage = async(req, res) => {
    try {
        const data = await Language.find({ isDeleted: false });
        res.status(200).json({data:data});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * listLanguage
 * Here fetch language data
 * return JSON
 */
const listLanguage = async(req, res) => {
    if(req.params.languageId == null) {
        return res.status(400).jsn({msg:"Parameter missing..."});
    }
    try {
        const languageData = await Language.findById({ _id: req.params.languageId });
        res.status(200).json({data:languageData});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * updateLanguage
 * Here update language
 * return JSON
 */
const updateLanguage = async(req, res) => {
    if(req.params.languageId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const update = await Language.findByIdAndUpdate(
            { _id: req.params.languageId },
            {
                $set: req.body
            }
        );
        res.status(200).json({msg:"Language updated successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

/**
 * deleteLanguage
 * Here delete language
 * return JSON
 */
const deleteLanguage = async(req, res) => {
    if(req.params.languageId == null) {
        return res.status(400).json({msg:"Parameter missing..."});
    }
    try {
        const deleteData = await Language.findByIdAndUpdate(
            { _id: req.params.languageId },
            {
                $set: {
                    isDeleted: true
                }
            });
        res.status(200).json({msg:"Language deleted successfully"});
    } catch (err) {
        console.log('Error => ',err.message);
        res.status(500).json({msg:"Something went wrong"});
    }
}

export default { createLanguage, listsLanguage, listLanguage, updateLanguage, deleteLanguage }