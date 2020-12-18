import bcrypt from 'bcrypt';
import User from '../../Models/User';
import Transaction from '../../Models/Transaction';
import config from '../../../config/config';
import jwt from 'jsonwebtoken';
import EmailTemplate from '../../Models/EmailTemplate';
import nodemailer from '../../../config/nodemailer';
import moment from 'moment';
import Car from '../../Models/Car';

/**
 * Admin Login
 * return JSON
 */
const adminLogin = (req, res) => {
    if (req.body.email == null || req.body.password == null) {
        return res.status(400).json({ msg: "Parameter missing..." });
    }
    User.findOne({
        email: req.body.email
    })
    .then( admin => {
        bcrypt.compare(req.body.password, admin.password)
        .then(isMatch => {
            if (isMatch) {
                if (admin.isAdmin == true) {
                    let token = jwt.sign({ id: admin._id, isAdmin: admin.isAdmin }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
                    const result = {
                        admin: admin,
                        token: token
                    };
                    res.status(200).json({ msg: "Successfully logedin", data: result });
                } else {
                    res.status(201).json({ msg: "You are not admin" });
                }
            } else {
                res.status(201).json({ msg: "Invalid password" });
            }
        })
        .catch(err => {
            console.log("Error => ", err.msg);
            res.status(500).json({ msg: "Something not right" });
        });
    })
    .catch(err => {
        console.log("Error => ", err.msg);
        res.status(401).json({ msg: "Invalid email" });
    });
}

/**
 * getProfile
 * Get admin profile details
 * return JSON
 */
const getProfile = async(req, res) => {
    if(req.params.adminId == null) {
        return res.status(400).jsn({ msg:"Parameter missing !!!" });
    }
    try {
        const admin = await User.findById({ _id: req.params.adminId });
        res.status(200).json({ data: admin });
    } catch(err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    };
}

/**
 * updateProfile
 * Here update admin profile details
 * return JSON
 */
const updateProfile = async(req, res) => {
    if(req.params.adminId == null) {
        return res.status(400).jsn({ msg:"Parameter missing !!!" });
    }
    try {
        let allData = req.body;
        if (req.file) {
            allData.profilePicture = config.USER_IMAGE_PATH + req.file.filename
            const updateAdmin = await User.findByIdAndUpdate(
                { _id: req.params.adminId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "Profile updated successfully" });
        } else {
            if(allData.profilePicture) delete allData.profilePicture;
            const updateAdmin = await User.findByIdAndUpdate(
                { _id: req.params.adminId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "Profile updated successfully" });
        }
    } catch(err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
}

/**
 * forgotPassword
 * @param req body
 * @returns json
 */
const forgotPassword = async(req, res) => {
    if(req.body.email == null){
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const user = await User.findOne({ email: req.body.email, isAdmin: true });
        if (user) {
            const otp = Math.floor(Math.random() * 999999) + 100000;
            const updateUser = await User.findByIdAndUpdate(
                { _id: user._id},
                {
                    $set: { otp: otp }
                });
            const getTemplate = await EmailTemplate.findById({
                _id: config.OTP_TEMPLATE_PRIMARY_ID
            });
            let to = req.body.email;
            let subject = getTemplate.emailSubject;
            let emailContent = getTemplate.emailContent;
            let body = emailContent.replace("[OTP]", otp);
            const response = await nodemailer.sendMail(subject,body,to);
            res.status(200).json({ data: req.body.email, msg: "OTP sent" });
        } else {
            res.status(401).json({ msg: "Admin not exist with this Email" });
        }
    } catch(err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * setPassword
 * @param req body
 * @returns json
 */
const setPassword = async(req, res) => {
    if(req.body.email == null || req.body.otp == null || req.body.password == null || req.body.confirmPassword == null){
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const user = await User.findOne({ email: req.body.email, isAdmin: true });
        if (user && user.otp == req.body.otp) {
            if(req.body.password == req.body.confirmPassword) {
                const hash = bcrypt.hashSync(req.body.password, config.SALT_ROUND);
                const updateUser = await User.findByIdAndUpdate(
                    { _id: user._id},
                    {
                        $set: { password: hash }
                    });
                res.status(200).json({ msg: "Password updated successfully" });
            } else {
                res.status(400).json({ msg: "Password and confirm password not match" });
            }
        } else {
            res.status(400).json({ msg: "You have enter wrong otp" });
        }
    } catch(err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * changePassword
 * Here update admin password
 * return JSON
 */
const changePassword = (req, res) => {
    if (req.params.adminId == null || req.body.currentPassword == null || req.body.newPassword == null || req.body.confirmPassword == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    User.findById({
        _id: req.params.adminId
    })
    .then(user => {
        if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
            if (req.body.newPassword == req.body.confirmPassword) {
                const hash = bcrypt.hashSync(req.body.newPassword, config.SALT_ROUND);
                User.findByIdAndUpdate(
                    { _id: req.params.adminId },
                    {
                        $set: {
                            password: hash
                        }
                    }
                )
                .then(() => {
                    res.status(200).json({ msg: "Password updated successfully" });
                })
                .catch(err => {
                    console.log('Error => ', err.msg);
                    res.status(500).json({ msg: "Something not right" });
                });
            } else {
                res.status(401).json({ msg: "New password and confirm password does not match" });
            }
        } else {
            res.status(400).json({ msg: "Current password is wrong" });
        }
    })
    .catch(err => {
        console.log('Error => ', err.msg);
        res.status(401).json({ msg: "Admin not found with this id" });
    });
}

/**
 * dashboard
 * Here get dashboard details
 * return JSON
 */
const dashboard = async (req, res) => {
    try {
        const userCount = await User.find({ isAdmin: false, isDeleted: false }).countDocuments();
        const transactionCount = await Transaction.find({ isDeleted : false }).countDocuments();
        const carCount = await Car.find({
        isDeleted: false
        }).countDocuments();
        // const feedbackCount = await Feedback.find({ isDeleted: false }).countDocuments();
        let elements = 14;
        let chartUsers = [];
        let chartCar = [];
        let chartLebels = [];
        let date = new Date();
        // let date2 = date;
        for (let i = elements; i >= 1; i--) {
            const userData = await User.find({
            createdDate: { $gt:date.setDate(date.getDate() - 1), $lt:date.setDate(date.getDate() + 1) }
            }).countDocuments();

            chartUsers.push(userData);
            chartCar.push(i);
            chartLebels.push(moment(date).format('dddd'));
            date.setDate(date.getDate() - 1);
        }
        const result = {
            totalUser: userCount,
            totalTransaction: transactionCount,
            totalCar: carCount,
            totalFeedback: 0,
            chartUsers : chartUsers,
            cahrtCar: chartCar,
            chartLebels : chartLebels
        }
        res.status(200).json({ data: result });
    } catch(err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong..." });
    }
}

export default { adminLogin, getProfile, updateProfile, forgotPassword, setPassword, changePassword, dashboard };