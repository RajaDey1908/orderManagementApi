import Category from '../../Models/Category';
import config from '../../../config/config';

/**
 * createCategory
 * Here add new category
 * return JSON
 */
const createCategory = async(req, res) => {
    try {
        if(req.file){
            const addCategory = await new Category({
                categoryName: req.body.categoryName,
                categoryImage: config.CATEGORY_IMAGE_PATH + req.file.filename
            })
            .save();
            res.status(200).json({msg:"Category has been added Successfully."});
        } else {
            const addCategory = await new Category({
                categoryName: req.body.categoryName
            })
            .save();
            res.status(200).json({msg:"Category has been added Successfully."});
        }
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listCategories
 * Here fetch all Category
 * return JSON
 */
const listCategories = async(req, res) => {
    try {
        const list = await Category.find({
            isDeleted: false
        })
        res.status(200).json({data: list});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listCategory
 * Here fetch Category details
 * return JSON
 */
const listCategory = async(req, res) => {
    if(req.params.categoryId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const category = await Category.findById({
            _id: req.params.categoryId
        });
        res.status(200).json({data: category});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * updateCategory
 * Here update Category details
 * return JSON
 */
const updateCategory = async(req, res) => {
    console.log('req.body',req.body)
    if(req.body.categoryId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const category = await Category.findById({
            _id: req.body.categoryId
        });
        if(category){
            if(req.file){
                const update = await Category.findByIdAndUpdate(
                    { _id: req.body.categoryId },
                    {
                        $set: {
                            categoryName: req.body.categoryName,
                            categoryImage: config.CATEGORY_IMAGE_PATH + req.file.filename,
                            isActive: req.body.isActive
                        }
                    }
                );
                res.status(200).json({msg:"Category has been updated"});
            } else {
                const update = await Category.findByIdAndUpdate(
                    { _id: req.body.categoryId },
                    {
                        $set: {
                            categoryName: req.body.categoryName,
                            isActive: req.body.isActive
                        }
                    }
                );
                res.status(200).json({msg:"Category has been updated"});
            }
        } else {
            res.status(401).json({msg: "Category not found with this id"});
        }  
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * deleteCategory
 * Here delete Category details
 * return JSON
 */
const deleteCategory = async(req, res) => {
    if(req.params.categoryId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const category = await Category.findByIdAndUpdate(
            { _id: req.params.categoryId },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        res.status(200).json({msg: "Category has been deleted"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { createCategory, listCategories, listCategory, updateCategory, deleteCategory }