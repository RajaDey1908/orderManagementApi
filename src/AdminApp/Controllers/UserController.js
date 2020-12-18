import bcrypt from 'bcrypt';
import User from '../../Models/User';
import config from '../../../config/config';

/**
 * createUser
 * return JSON
 */
const createUser = async(req, res) => {
    if(req.body.firstName == null || req.body.lastName == null || req.body.email == null || req.body.password == null) {
        return res.status(400).json({ msg:"Parameter missing..." })
    }
    try {
        const emailExist = await User.find({email: req.body.email});
        if(emailExist.length > 0){
            res.status(401).json({msg:"Email already exist"});
        } else {
            const allData = req.body
            const hash = bcrypt.hashSync(allData.password, config.SALT_ROUND);
            delete allData.password;
            allData.password = hash;
            allData.name = allData.firstName+' '+allData.lastName;
            allData.isAdminVerified = true;
            allData.isEmailVerified = true;
            const addUser = await new User(allData).save();
            res.status(200).json({msg:"User has been added Successfully."});
        }
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listUsers
 * return JSON
 */
const listUsers = async(req, res) => {
    if(req.query.keyword == null || req.query.page == null){
        return res.status(400).send({ack:1, message:"Parameter missing..."})
    }
    try {
        let keyword = req.query.keyword;
        let limit = 30;
        let page = req.query.page;
        var skip = (limit*page);
        const list = await User.find({
            isAdmin: false,
            isDeleted: false,
            $or: [
                { name: { $regex: keyword, $options: 'm' } },
                { email: { $regex: keyword, $options: 'm' } }
            ]
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 'DESC' });
        const listAll = await User.find({
            isAdmin: false,
            isDeleted: false,
            $or: [
                { name: { $regex: keyword, $options: 'm' } },
                { email: { $regex: keyword, $options: 'm' } }
            ]
        }).countDocuments();
        const AllData = {
            'list': list,
            'count': listAll,
            'limit': limit
        };
        res.status(200).json({data: AllData});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * listUser
 * return JSON
 */
const listUser = async(req, res) => {
    if(req.params.userId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const user = await User.findById({
            _id: req.params.userId
        });
        res.status(200).json({data: user});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * updateUser
 * return JSON
 */
const updateUser = async(req, res) => {
    if(req.params.userId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const user = await User.findById({
            _id: req.params.userId
        });
        if(user){
            if(req.body.phoneNumber) {
                const phoneExist = await User.find({
                    phoneNumber: req.body.phoneNumber,
                    _id: { $ne: req.params.userId }
                });
                if(phoneExist.length > 0){
                    return res.status(201).json({msg:"Phone number already exist"});
                }
            }
            const emailExist = await User.find({
                email: req.body.email,
                _id: { $ne: req.params.userId }
            });
            if(emailExist.length > 0){
                res.status(401).json({msg:"Email already exist"});
            } else {
                const update = await User.findByIdAndUpdate(
                    { _id: req.params.userId },
                    {
                        $set: req.body
                    }
                );
                res.status(200).json({msg:"User has been updated"});
            }
        } else {
            res.status(401).json({msg: "User not found with this id"});
        }  
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}

/**
 * deleteUser
 * return JSON
 */
const deleteUser = async(req, res) => {
    if(req.params.userId == null) {
        return res.status(400).json({msg: "parameter missing.."});
    }
    try {
        const user = await User.findByIdAndUpdate(
            { _id: req.params.userId },
            {
                $set: {
                    isDeleted: true
                }
            }
        );
        res.status(200).json({msg: "User has been deleted"});
    } catch (err) {
        console.log("Error => ",err.message);
        res.status(500).json({msg:"Something went wrong."});
    }
}
export default { createUser, listUsers, listUser, updateUser, deleteUser }