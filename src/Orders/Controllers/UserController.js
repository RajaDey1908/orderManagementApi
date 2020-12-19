import User from '../../Models/User';
import EmailTemplate from '../../Models/EmailTemplate';
import Favorite from '../../Models/Favorite';
import config from '../../../config/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from '../../../config/nodemailer';
import mongoose from 'mongoose';
import Car from '../../Models/Car';

import Core from '@alicloud/pop-core';
var client = new Core({
    accessKeyId: 'LTAI4GCysgQPsCgat7pBXmE4',
    accessKeySecret: 'n48zrgegoG4qLRNVr2CdNbToA21HTq',
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});

/**
 * userLogin
 * @param req body
 * return JSON
 */
const userLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.find({
            $or: [{ email: email }, { phoneNumber: email }]
        });
        if (user.length > 0 && req.body.countryCode) {
            if (req.body.countryCode != user[0].countryCode) {
                return res.status(201).json({ msg: 'Country code does not verified' });
            }
        }
        if (user.length > 0 && await bcrypt.compareSync(password, user[0].password)) {
            if (req.body.countryCode == user[0].countryCode) {

            }
            if (user[0].isActive === true && user[0].isDeleted === false) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: user[0]._id },
                    {
                        $set: { lastLogin: new Date().toISOString(), isLogout: false }
                    }
                )
                let token = jwt.sign({ id: user[0]._id, isAdmin: user[0].isAdmin }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
                res.status(200).json({ msg: 'logged in succesfully', data: user[0], token: token });
            } else {
                res.status(201).json({ msg: 'Account not verified' });
            }
        } else {
            res.status(201).json({ msg: 'Wrong email or password' });
        }
    } catch (err) {
        console.log('Error => ', err.message)
        res.status(500).json({ message: "Something went wrong!!!" });
    }
}

/**
 * userSocialLogin
 * @param req body
 * return JSON
 */
const userSocialLogin = async (req, res) => {
    if (req.body.email == null || req.body.socialType == null || req.body.socialId == null || req.body.name == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const user = await User.find({ email: req.body.email });
        if (user.length > 0) {
            const updateUser = await User.findByIdAndUpdate(
                { _id: user[0]._id },
                {
                    $set: {
                        name: req.body.name,
                        socialId: req.body.socialId,
                        socialType: req.body.socialType,
                        locationName: req.body.locationName,
                        location: req.body.location,
                        isSocialLogin: true,
                        isEmailVerified: true,
                        lastLogin: new Date().toISOString(),
                        isLogout: false
                    }
                }
            )
            const userData = await User.findById({ _id: user[0]._id });
            let token = jwt.sign({ id: user[0]._id, isAdmin: false }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
            res.status(200).json({ msg: 'logged in succesfully', data: userData, token: token });
        } else {
            const userExist = await User.find({ socialId: req.body.socialId });
            if (userExist.length > 0) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: userExist[0]._id },
                    {
                        $set: {
                            name: req.body.name,
                            email: req.body.email,
                            socialType: req.body.socialType,
                            locationName: req.body.locationName,
                            location: req.body.location,
                            isSocialLogin: true,
                            isEmailVerified: true,
                            lastLogin: new Date().toISOString(),
                            isLogout: false
                        }
                    }
                )
                const userData = await User.findById({ _id: userExist[0]._id });
                let token = jwt.sign({ id: userExist[0]._id, isAdmin: false }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
                res.status(200).json({ msg: 'logged in succesfully', data: userData, token: token });
            } else {
                const addUser = await new User({
                    name: req.body.name,
                    email: req.body.email,
                    socialId: req.body.socialId,
                    socialType: req.body.socialType,
                    locationName: req.body.locationName,
                    location: req.body.location,
                    isSocialLogin: true,
                    isEmailVerified: true,
                    lastLogin: new Date().toISOString(),
                    isLogout: false
                }).save();
                const userData = await User.findById({ _id: addUser._id });
                let token = jwt.sign({ id: userData._id, isAdmin: false }, config.SECRET_KEY, { algorithm: config.JWT_ALGORITHM, expiresIn: config.EXPIRES_IN }); // expires in 30 days
                res.status(200).json({ msg: 'logged in succesfully', data: userData, token: token });
            }
        }
    } catch (err) {
        console.log('Error => ', err.message)
        res.status(500).json({ message: "Something went wrong!!!" });
    }
}

/**
 * createUser
 * @param req body
 * @returns JSON
 */
const createUser = async (req, res) => {
    if (req.body.name == null || req.body.password == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        if (req.body.email) {
            const emailExist = await User.find({ email: req.body.email });
            const hash = bcrypt.hashSync(req.body.password, config.SALT_ROUND);
            // const otp = Math.floor(Math.random() * 999999) + 100000;
            if (emailExist.length > 0) {
                if (emailExist[0].isEmailVerified == false) {
                    const updateUser = await User.findByIdAndUpdate(
                        { _id: emailExist[0]._id },
                        {
                            $set: {
                                name: req.body.name,
                                locationName: req.body.locationName,
                                location: req.body.location,
                                countryCode: req.body.countryCode ? req.body.countryCode : '',
                                password: hash
                            }
                        }
                    );
                    res.status(200).json({ msg: "You have successfully signup. Welcome to CarExchange" });
                } else {
                    res.status(201).json({ msg: "Email already Exist" });
                }
            } else {
                const addUser = await new User({
                    name: req.body.name,
                    locationName: req.body.locationName,
                    location: req.body.location,
                    countryCode: req.body.countryCode ? req.body.countryCode : '',
                    password: hash,
                    email: req.body.email
                }).save();
                res.status(200).json({ msg: "You have successfully signup. Welcome to CarExchange" });
            }
        } else if (req.body.phoneNumber) {
            const emailExist = await User.find({ phoneNumber: req.body.phoneNumber });
            const hash = bcrypt.hashSync(req.body.password, config.SALT_ROUND);
            // const otp = Math.floor(Math.random() * 999999) + 100000;
            if (emailExist.length > 0) {
                if (emailExist[0].isPhoneVerified == false) {
                    const updateUser = await User.findByIdAndUpdate(
                        { _id: emailExist[0]._id },
                        {
                            $set: {
                                name: req.body.name,
                                locationName: req.body.locationName,
                                location: req.body.location,
                                countryCode: req.body.countryCode ? req.body.countryCode : '',
                                password: hash
                            }
                        }
                    );
                    res.status(200).json({ msg: "You have successfully signup. Welcome to CarExchange" });
                } else {
                    res.status(201).json({ msg: "Phone number already Exist" });
                }
            } else {
                const addUser = await new User({
                    phoneNumber: req.body.phoneNumber,
                    name: req.body.name,
                    locationName: req.body.locationName,
                    location: req.body.location,
                    countryCode: req.body.countryCode ? req.body.countryCode : '',
                    password: hash
                }).save();
                res.status(200).json({ msg: "You have successfully signup. Welcome to CarExchange" });
            }
        } else {
            res.status(400).json({ msg: "Email or phone number missing" });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * emailOTPSend
 * @param req body
 * @returns JSON
 */
const emailOTPSend = async (req, res) => {
    if (req.body.email == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const emailExist = await User.find({ email: req.body.email });
        if (emailExist.length > 0 && emailExist[0].isActive == true) {
            const otp = Math.floor(Math.random() * 999999) + 100000;
            const updateUser = await User.findByIdAndUpdate(
                { _id: emailExist[0]._id },
                {
                    $set: {
                        otp: otp
                    }
                }
            );
            const getTemplate = await EmailTemplate.findById({
                _id: config.OTP_TEMPLATE_PRIMARY_ID
            });
            let to = req.body.email;
            let subject = getTemplate.emailSubject;
            let emailContent = getTemplate.emailContent;
            let body = emailContent.replace("[OTP]", otp);
            const response = nodemailer.sendMail(subject, body, to);
            res.status(200).json({ msg: "OTP sent successfully", data: req.body.email });
        } else {
            res.status(201).json({ msg: "Email not exist" });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * signupEmailVerification
 * @param req body
 * @returns JSON
 */
const signupEmailVerification = async (req, res) => {
    if (req.body.email == null || req.body.otp == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const emailExist = await User.find({ email: req.body.email });
        if (emailExist.length > 0 && emailExist[0].otp == req.body.otp) {
            const updateUser = await User.findByIdAndUpdate(
                { _id: emailExist[0]._id },
                {
                    $set: {
                        isEmailVerified: true
                    }
                }
            );
            res.status(200).json({ msg: "Email verified. Welcome to CarExchange" });
        } else {
            res.status(201).json({ msg: "OTP does not match" });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * forgotPassword
 * @param req body
 * @returns json
 */
const forgotPassword = async (req, res) => {
    // if(req.body.email == null){
    //     return res.status(400).json({ msg: "Parameter missing.." });
    // }
    try {
        console.log('req.body', req.body)
        console.log('req.body.email', req.body.email)
        // const user = await User.findOne({ email: req.body.email });
        const user = await User.find({
            $or: [{ email: req.body.email }, { phoneNumber: req.body.email }]
        });
        if (user.length > 0) {
            const otp = Math.floor(Math.random() * 999999) + 100000;
            const updateUser = await User.findByIdAndUpdate(
                { _id: user[0]._id },
                {
                    $set: { otp: otp }
                });
            if (req.body.countryCode) {
                var otpObj = {
                    code: otp
                }
                var number = req.body.countryCode + '' + req.body.email;
                var params = {
                    "RegionId": "cn-hangzhou",
                    "PhoneNumbers": number,
                    "SignName": "地球村远邻换车",
                    "TemplateCode": "SMS_196617471",
                    "TemplateParam": JSON.stringify(otpObj)
                }

                var requestOption = {
                    method: 'POST'
                };
                //Step 4
                const sendMessage = await client.request('SendSms', params, requestOption);
                console.log('sendMessage', sendMessage)
                if (sendMessage.Message == 'OK') {
                    res.status(200).json({ data: req.body.email, msg: "OTP sent" });
                } else {
                    res.status(200).json({ msg: "Invalid phone number" });
                }
            } else {
                const getTemplate = await EmailTemplate.findById({
                    _id: config.FORGOT_PASSWORD
                });
                const to = req.body.email;
                const subject = getTemplate.emailSubject;
                const emailContent = getTemplate.emailContent;
                let body = emailContent.replace("[OTP]", otp);
                const response = await nodemailer.sendMail(subject, body, to);
                res.status(200).json({ data: req.body.email, msg: "OTP sent" });
            }

        } else {
            if (req.body.countryCode) {
                res.status(201).json({ msg: "Phone number not exist" });
            } else {
                res.status(201).json({ msg: "Email not exist" });
            }
        }
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * setPassword
 * @param req body
 * @returns json
 */
const setPassword = async (req, res) => {
    if (req.body.email == null || req.body.otp == null || req.body.password == null || req.body.confirmPassword == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const user = await User.findOne({ $or: [{ email: req.body.email }, { phoneNumber: req.body.email }] });
        if (user && user.otp == req.body.otp) {
            if (req.body.password == req.body.confirmPassword) {
                const hash = bcrypt.hashSync(req.body.password, config.SALT_ROUND);
                const updateUser = await User.findByIdAndUpdate(
                    { _id: user._id },
                    {
                        $set: { password: hash }
                    });
                res.status(200).json({ msg: "Password updated successfully" });
            } else {
                res.status(201).json({ msg: "Password and confirm password not match" });
            }
        } else {
            res.status(201).json({ msg: "You have enter wrong otp" });
        }
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * getUserDetails
 * @param req body
 * @returns json
 */
const getUserDetails = async (req, res) => {
    if (req.params.userId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        const user = await User.findById({ _id: req.params.userId });
        res.status(200).json({ data: user });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * createFavourite
  * @param req body
  * @returns JSON
 */
const createFavourite = async (req, res) => {
    try {
        const car = await Car.findById({ _id: req.body.carId });
        const favorite = await Favorite.find({
            carId: req.body.carId,
            userId: req.body.userId
        });
        if (favorite.length > 0) {
            if (favorite[0].isActive == true) {
                const updateFavourite = await Favorite.findByIdAndUpdate(
                    { _id: favorite[0]._id },
                    {
                        $set: { isActive: false }
                    }
                );
                res.status(200).json({ msg: "success" });
            } else {
                const updateFavourite = await Favorite.findByIdAndUpdate(
                    { _id: favorite[0]._id },
                    {
                        $set: { isActive: true }
                    }
                );
                res.status(200).json({ msg: "Success" });
            }
        } else {
            const addFavourite = await new Favorite({
                carId: req.body.carId,
                userId: req.body.userId,
                carUserId: car.userId
            })
                .save();
            res.status(200).json({ msg: "Success" });
        }
    } catch (err) {
        console.log("Error => 11", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * myFavourite
  * @param req body
  * @returns JSON
 */
const myFavourite = async (req, res) => {
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        let userId = req.id;
        let limit = 20;
        let page = req.query.page;
        var skip = (limit * page);
        const favorites = await Favorite.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                    isActive: true,
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: 'cars',
                    localField: 'carId',
                    foreignField: '_id',
                    as: 'carDetails'
                }
            }
        ])
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'desc' });
        for (let i = 0; i < favorites.length; i++) {
            const user = await User.findById({ _id: favorites[i].carDetails[0].userId });
            favorites[i].carDetails[0]['userDetails'] = user;
        }
        res.status(200).json({ data: favorites });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * updateUser
  * @param req body
  * @returns JSON
 */
const updateUser = async (req, res) => {
    if (req.params.userId == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        console.log('req,body===>>> ', req.body)
        var allData = req.body;
        if(req.body.phoneNumber) {
            const phoneExist = await User.find({
                phoneNumber: req.body.phoneNumber,
                _id: { $ne: req.params.userId }
            });
            if(phoneExist.length > 0){
                return res.status(201).json({msg:"Phone number already exist"});
            }
        }
        // var travellerData = {};
        // var destinationData = {};
        // var groupData = {};
        if (allData.traveller) {
            // travellerData = allData.traveller;
            if (allData.traveller.length > 0) {
                const updateTravellerData = await User.findByIdAndUpdate(
                    { _id: req.params.userId },
                    {
                        $push: {
                            traveller: allData.traveller
                        }
                    }
                );
            }
            delete allData.traveller
        }
        if (allData.preferredDestination) {
            // destinationData = allData.preferredDestination;
            if (allData.preferredDestination.length > 0) {
                const updateDestinationData = await User.findByIdAndUpdate(
                    { _id: req.params.userId },
                    {
                        $push: {
                            preferredDestination: allData.preferredDestination
                        }
                    }
                );
            }
            delete allData.preferredDestination
        }
        if (allData.group) {
            // groupData = allData.group;
            if (allData.group.length > 0) {
                const updateGroupData = await User.findByIdAndUpdate(
                    { _id: req.params.userId },
                    {
                        $set: {
                            group: allData.group
                        }
                    }
                );
            }
            delete allData.group
        }
        const updateData = await User.findByIdAndUpdate(
            { _id: req.params.userId },
            {
                $set: allData
            }
        );
        // const updateTravellerData = await User.findByIdAndUpdate(
        //     { _id: req.params.userId },
        //     {
        //         $push: { 
        //             traveller: travellerData,
        //             preferredDestination: destinationData,
        //             group: groupData
        //         }
        //     }
        // );
        res.status(200).json({ msg: "User updated successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}


/**
 * updateUserImage
 * @param req body
 * @returns JSON
 */
const updateUserImage = async (req, res) => {
    if (req.params.userId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        console.log("in update user image-------")
        const allData = req.body;
        // console.log('allData ===> ', allData)
        const userDetails = await User.find({
            _id: req.params.userId,
        });
        if (userDetails.length > 0) {
            if ((userDetails[0].profilePicture.length > 0)) {

                let oldCarImages = JSON.parse(JSON.stringify(userDetails[0].profilePicture))
                let oldImageRemoveId = allData.oldImageRemoveId

                let filteredImages = []
                    filteredImages = oldCarImages.filter(function (el) { return el._id != oldImageRemoveId; });
                let updateData = {
                    profilePicture: filteredImages
                }
                const updateCar = await User.findByIdAndUpdate(
                    { _id: req.params.userId },
                    {
                        $set: updateData
                    }
                );
                res.status(200).json({ msg: "User Image updated successfully" });

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
* userImageUpload
 * @param req body
 * @returns JSON
*/
const userImageUpload = async (req, res) => {
    if (req.params.userId == null) {
        return res.status(400).json({ msg: "Parameter missing..." });
    }
    try {
        const userDetails = await User.find({
            _id: req.params.userId,
        });
        // console.log("userDetails--", userDetails)

        let oldCarImages = [];
        if (userDetails.length > 0) {
            if (JSON.stringify(userDetails[0].profilePicture.length > 0)) {
                oldCarImages = JSON.parse(JSON.stringify(userDetails[0].profilePicture))
            }
        }
        // console.log("oldCarImages", oldCarImages)

        let filesAmount = req.files.length;
        let total_image = [];
        for (let i = 0; i < filesAmount; i++) {
            total_image.push({ image: config.USER_IMAGE_PATH + req.files[i].filename });
        }
        // console.log("total_image", total_image)

        let finalTotalImage = oldCarImages.concat(total_image);

        // console.log("finalTotalImage", finalTotalImage)


        if (req.files) {
            const updateImage = await User.findByIdAndUpdate(
                { _id: req.params.userId },
                {
                    $set: { profilePicture: finalTotalImage }
                }
            );
            res.status(200).json({ msg: "Image uploaded successfully" })

        } else {
            res.status(400).json({ msg: "Image missing..." });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * updateTraveller
 * here update subdocument
 * @param req body
 * @returns JSON
 */
const updateTraveller = async (req, res) => {
    if (req.params.travellerId == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const userId = req.id;
        const updateUser = await User.findOneAndUpdate(
            { _id: userId, "traveller._id": req.params.travellerId },
            {
                $set: {
                    "traveller.$": req.body
                }
            }
        );
        res.status(200).json({ msg: "Traveller updated successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * deleteTraveller
 * here delete subdocument
 * @param req body
 * @returns JSON
 */
const deleteTraveller = async (req, res) => {
    if (req.params.travellerId == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const userId = req.id;
        const updateUser = await User.findByIdAndUpdate(
            { _id: userId },
            {
                $pull: {
                    'traveller': { _id: req.params.travellerId }
                }
            }
        );
        res.status(200).json({ msg: "Traveller successfully deleted" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * updateDestination
 * here update subdocument
 * @param req body
 * @returns JSON
 */
const updateDestination = async (req, res) => {
    if (req.params.destinationId == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const userId = req.id;
        console.log('userId => ', userId);
        console.log('req.params.destinationId => ', req.params.destinationId);
        console.log('req.body => ', req.body);
        const updateUser = await User.findOneAndUpdate(
            { _id: userId, "preferredDestination._id": req.params.destinationId },
            {
                $set: {
                    "preferredDestination.$": req.body
                }
            }
        );
        res.status(200).json({ msg: "Destination updated successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * deleteDestination
 * here delete subdocument
 * @param req body
 * @returns JSON
 */
const deleteDestination = async (req, res) => {
    if (req.params.destinationId == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    try {
        const userId = req.id;
        const updateUser = await User.findByIdAndUpdate(
            { _id: userId },
            {
                $pull: {
                    'preferredDestination': { _id: req.params.destinationId }
                }
            }
        );
        res.status(200).json({ msg: "Destination successfully deleted" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * changePassword
 * Here update user password
 * return JSON
 */
const changePassword = async (req, res) => {
    if (req.body.currentPassword == null || req.body.newPassword == null || req.body.confirmPassword == null) {
        return res.status(400).json({ msg: "Parameter missing.." });
    }
    const userId = req.id;
    try {
        const getUser = await User.findById({ _id: userId });
        if (getUser) {
            if (bcrypt.compareSync(req.body.currentPassword, getUser.password)) {
                if (req.body.newPassword == req.body.confirmPassword) {
                    const hash = bcrypt.hashSync(req.body.newPassword, config.SALT_ROUND);
                    const updateUser = await User.findByIdAndUpdate(
                        { _id: userId },
                        {
                            $set: {
                                password: hash
                            }
                        }
                    );
                    res.status(200).json({ msg: "Password updated successfully" });
                } else {
                    res.status(201).json({ msg: "New password and confirm password does not match" });
                }
            } else {
                res.status(201).json({ msg: "Current password is wrong" });
            }
        } else {
            res.status(201).json({ msg: "User not found with this id" });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

const test = async (req, res) => {
    try {
        //Step 3
        // var params = {
        // "RegionId": "ap-southeast-1",
        // "To": "+639453177927",
        // "TemplateCode": "Hi, How are you ?",
        // "From": "+918016698507"
        // // "TemplateParam": "<templateParam>", //Optional
        // }
        var otp = Math.floor(Math.random() * 999999) + 100000;
        var otpObj = {
            code: otp
        }
        // var number = "+8613537579531";
        var number = "+919732825387";
        var params = {
            "RegionId": "cn-hangzhou",
            "PhoneNumbers": number,
            "SignName": "地球村远邻换车",
            "TemplateCode": "SMS_196617471",
            "TemplateParam": JSON.stringify(otpObj)
        }

        var requestOption = {
            method: 'POST'
        };
        //Step 4
        const sendMessage = await client.request('SendSms', params, requestOption);
        console.log('sendMessage', sendMessage)
        if (sendMessage.Message == 'OK') {
            console.log('success')
        } else {
            console.log('fail')
        }
        console.log('result', sendMessage);

        res.status(200).json({ msg: "Destination successfully deleted", sendMessage: sendMessage });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}
export default { userLogin, userSocialLogin, createUser, emailOTPSend, signupEmailVerification, forgotPassword, setPassword, getUserDetails, createFavourite, myFavourite, updateUser, userImageUpload, updateTraveller, deleteTraveller, updateDestination, deleteDestination, changePassword, test, updateUserImage }