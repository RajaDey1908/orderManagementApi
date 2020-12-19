import Chat from '../../Models/Chat';
import Car from '../../Models/Car';
import ChatUser from '../../Models/ChatUser';
import Exchange from '../../Models/Exchange';
import Category from '../../Models/Category';
import Amenity from '../../Models/Amenity';
import Accessibility from '../../Models/Accessibility';
import Favorite from '../../Models/Favorite';
import config from '../../../config/config';
import nodemailer from '../../../config/nodemailer';
import mongoose from 'mongoose';


/**
 * createExchange
 * @param req body
 * @returns JSON
 */
const createExchange = async (req, res) => {
    if (req.body.arrivalDate == null || req.body.departureDate == null || req.body.guest == null || req.body.exchangeType == null || req.body.drivingType == null || req.body.carId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const userId = req.id;
        const allData = req.body;
        const carData = await Car.findById({ _id: req.body.carId });
        allData.requestSenderId = userId;
        allData.requestReceiverId = carData.userId;
        console.log('allData ===> ', allData)
        // return
        const addRequest = await new Exchange(allData).save();

        let sendMessage = ""
        if (req.body.exchangeMessage) {
            sendMessage = req.body.exchangeMessage
        } else {
            sendMessage = "hi"
        }

        let senderId = userId
        let receiverId = carData.userId
        // let roomId = senderId + '_' + receiverId;

        let roomId;
        const getChatData = await Chat.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
            .limit(2);
        if (getChatData.length > 0) {
            roomId = getChatData[0].roomId;
        } else {
            roomId = senderId + '_' + receiverId;
        }



        const existChat = await ChatUser.find({ roomId: roomId, isActive: true, isDeleted: false });
        // const existChat = await ChatUser.find(chatUserFilterData);

        // const existChat = await ChatUser.find({ roomId: roomId, isActive: true, isDeleted: false });
        if (existChat.length > 0) {
            const updateData = await ChatUser.findByIdAndUpdate(
                { _id: existChat[0]._id },
                {
                    $set: { senderId: senderId, receiverId: receiverId, message: sendMessage, updatedDate: new Date().toISOString() }
                }
            )
        } else {
            const updateData = await new ChatUser({
                senderId: senderId, receiverId: receiverId, message: sendMessage, roomId: roomId, updatedDate: new Date().toISOString()
            }).save();
        }

        const addChat = await new Chat({
            roomId: roomId,
            senderId: senderId,
            receiverId: receiverId,
            message: sendMessage
        }).save();

        res.status(200).json({ msg: "Request sent successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * onlyMessage
 * @param req body
 * @returns JSON
 */
const onlyMessage = async (req, res) => {
    if (req.body.exchangeMessage == null || req.body.carId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const userId = req.id;
        const allData = req.body;
        const carData = await Car.findById({ _id: req.body.carId });
        allData.requestSenderId = userId;
        allData.requestReceiverId = carData.userId;
        // allData.ReadyForExchange = true
        // console.log('allData ===> ', allData)
        // return
        let sendMessage = ""
        if (req.body.exchangeMessage) {
            sendMessage = req.body.exchangeMessage
        } else {
            sendMessage = "hi"
        }

        let senderId = userId
        let receiverId = carData.userId
        // let roomId = senderId + '_' + receiverId;

        let roomId;
        const getChatData = await Chat.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
            .limit(2);
        if (getChatData.length > 0) {
            roomId = getChatData[0].roomId;
        } else {
            roomId = senderId + '_' + receiverId;
        }

        console.log("senderId--->>>>>>", senderId)
        console.log("receiverId--->>>>>>", receiverId)
        console.log("roomId--->>>>>>", roomId)

        const existChat = await ChatUser.find({ roomId: roomId, isActive: true, isDeleted: false });
        // const existChat = await ChatUser.find(chatUserFilterData);
        console.log("existChat detial---", existChat)
        if (existChat.length > 0) {
            const updateData = await ChatUser.findByIdAndUpdate(
                { _id: existChat[0]._id },
                {
                    $set: { senderId: senderId, receiverId: receiverId, message: sendMessage, updatedDate: new Date().toISOString() }
                }
            )
        } else {
            const updateData = await new ChatUser({
                senderId: senderId, receiverId: receiverId, message: sendMessage, roomId: roomId, updatedDate: new Date().toISOString()
            }).save();
        }

        const addChat = await new Chat({
            roomId: roomId,
            senderId: senderId,
            receiverId: receiverId,
            message: sendMessage
        }).save();

        const addRequest = await new Exchange(allData).save();

        res.status(200).json({ msg: "Request sent successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}


/**
 * onlyMessage
 * @param req body
 * @returns JSON
 */
const sendInterest = async (req, res) => {
    if (req.body.exchangeMessage == null || req.body.carId == null || req.body.exchangeId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        console.log(" in sende interest---", req.body)
        const userId = req.id;
        const allData = {};
        const carData = await Car.findById({ _id: req.body.carId });
        allData.readyForExchange = true
        let sendMessage = ""
        if (req.body.exchangeMessage) {
            sendMessage = req.body.exchangeMessage
        } else {
            sendMessage = "hi"
        }

        let senderId = userId
        let receiverId = carData.userId
        // let roomId = senderId + '_' + receiverId;
        let roomId;
        const getChatData = await Chat.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        })
            .limit(2);
        if (getChatData.length > 0) {
            roomId = getChatData[0].roomId;
        } else {
            roomId = senderId + '_' + receiverId;
        }
        const existChat = await ChatUser.find({ roomId: roomId, isActive: true, isDeleted: false });
        if (existChat.length > 0) {
            const updateData = await ChatUser.findByIdAndUpdate(
                { _id: existChat[0]._id },
                {
                    $set: { senderId: senderId, receiverId: receiverId, message: sendMessage, updatedDate: new Date().toISOString() }
                }
            )
        } else {
            const updateData = await new ChatUser({
                senderId: senderId, receiverId: receiverId, message: sendMessage, roomId: roomId, updatedDate: new Date().toISOString()
            }).save();
        }
        console.log("sendMessage msg", sendMessage)

        const addChat = await new Chat({
            roomId: roomId,
            senderId: senderId,
            receiverId: receiverId,
            message: sendMessage
        }).save();

        console.log("after msg")
        // const addRequest = await new Exchange(allData).save();
        const exchangData = await Exchange.find({
            _id: mongoose.Types.ObjectId(req.body.exchangeId)
        });

        console.log("exchangData", exchangData)
        console.log("allData", allData)

        if (exchangData.length > 0) {
            const updateCar = await Exchange.findByIdAndUpdate(
                { _id: req.body.exchangeId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "Exchange updated successfully" });
        } else {
            res.status(200).json({ msg: "Exchang Not Found" });
        }

        // res.status(200).json({ msg: "Request sent successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}

/**
 * listsExchangeRequest
 * @param req body
 * @returns json
 */
const listsExchangeRequest = async (req, res) => {
    let userId = req.id;
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        let filterData = {
            isActive: true,
            isDeleted: false,
            requestReceiverId: mongoose.Types.ObjectId(userId)
        };
        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);
        const exchangeData = await Exchange.aggregate([
            {
                $match: filterData
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'requestSenderId',
                    foreignField: '_id',
                    as: 'userDetails'
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
        res.status(200).json({ data: exchangeData });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * listExchangeRequest
 * @param req body
 * @returns json
 */
const listExchangeRequest = async (req, res) => {
    let userId = req.id;
    if (req.params.exchangeId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        const exchangeData = await Exchange.findById({
            _id: req.params.exchangeId
        })
            .populate({
                path: 'requestSenderId',
                model: 'user'
            })
            .populate({
                path: 'carId',
                model: 'car'
            });
        const result = {
            exchange: exchangeData
        }
        res.status(200).json({ data: result });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * sendExchangeRequest
 * @param req body
 * @returns json
 */
const sendExchangeRequest = async (req, res) => {
    // console.log("from sendExchangeRequest---")
    // console.log("req.body---", req.body)
    let userId = req.id;
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {

        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);

        let filterData = {
            isActive: true,
            isDeleted: false,
            $or: [
                { requestSenderId: mongoose.Types.ObjectId(userId) },
                { requestReceiverId: mongoose.Types.ObjectId(userId) }
            ]
        };

        filterData.finalisedExchange = req.body.finalisedExchange
        filterData.actualExchange = req.body.actualExchange

        const exchangeData = await Exchange.find(filterData)
            .populate({
                path: 'carId',
                model: 'car',
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'desc' });

        res.status(200).json({ data: exchangeData });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}


/**
 * sendPastExchangeRequest
 * @param req body
 * @returns json
 */
const sendPastExchangeRequest = async (req, res) => {
    let userId = req.id;
    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {

        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);

        let filterData = {
            isActive: true,
            isDeleted: false,
            $or: [
                { requestSenderId: mongoose.Types.ObjectId(userId) },
                { requestReceiverId: mongoose.Types.ObjectId(userId) }
            ]
        };

        // if (req.body.actualExchange) {
        //     filterData.actualExchange = req.body.actualExchange
        // }
        filterData.finalisedExchange = true

        const exchangeData = await Exchange.find(filterData)
            .populate({
                path: 'carId',
                model: 'car',
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'desc' });

        res.status(200).json({ data: exchangeData });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}


/**
 * createExchange
 * @param req body
 * @returns JSON
 */
const updateExchange = async (req, res) => {

    if (req.body.arrivalDate == null || req.body.departureDate == null || req.body.guest == null || req.body.exchangeType == null || req.body.drivingType == null || req.params.exchangeId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const allData = req.body;
        const exchangData = await Exchange.find({
            _id: mongoose.Types.ObjectId(req.params.exchangeId)
        });

        if (exchangData.length > 0) {
            const updateCar = await Exchange.findByIdAndUpdate(
                { _id: req.params.exchangeId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "Exchange updated successfully" });
        } else {
            res.status(200).json({ msg: "Exchang Not Found" });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}


/**
 * createExchange
 * @param req body
 * @returns JSON
 */
const finalisedExchange = async (req, res) => {

    if (req.params.exchangeId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const allData = {
            finalisedExchange: true
        };
        const exchangData = await Exchange.find({
            _id: mongoose.Types.ObjectId(req.params.exchangeId)
        });

        if (exchangData.length > 0) {
            const updateCar = await Exchange.findByIdAndUpdate(
                { _id: req.params.exchangeId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "Exchange Finalized Successfully" });
        } else {
            res.status(200).json({ msg: "Exchang Not Found" });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}


/**
 * actualExchange
 * @param req body
 * @returns JSON
 */
const actualExchange = async (req, res) => {

    if (req.params.exchangeId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const allData = {
            actualExchange: true
        };
        const exchangData = await Exchange.find({
            _id: mongoose.Types.ObjectId(req.params.exchangeId)
        });

        if (exchangData.length > 0) {
            const updateCar = await Exchange.findByIdAndUpdate(
                { _id: req.params.exchangeId },
                {
                    $set: allData
                }
            );
            res.status(200).json({ msg: "Actual Exchange updated successfully" });
        } else {
            res.status(200).json({ msg: "Exchang Not Found" });
        }
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}



/**
 * exchangeCarList
 * @param req body
 * @returns json
 */
const exchangeCarList = async (req, res) => {
    let userId = req.id;
    let partnerId = req.body.partnerId




    if (req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {

        // let limit = 20;
        // let page = req.query.page;
        // let skip = (limit * page);

        // let filterData = {
        //     isActive: true,
        //     isDeleted: false,
        //     $or: [
        //         {
        //             $and: [
        //                 { requestSenderId: mongoose.Types.ObjectId(userId) },
        //                 { requestReceiverId: mongoose.Types.ObjectId(partnerId) }
        //             ]
        //         },
        //         {
        //             $and: [
        //                 { requestSenderId: mongoose.Types.ObjectId(partnerId) },
        //                 { requestReceiverId: mongoose.Types.ObjectId(userId) }
        //             ]
        //         }
        //     ]


        // };

        // // filterData.finalisedExchange = req.body.finalisedExchange
        // // filterData.actualExchange = req.body.actualExchange

        // const exchangeData = await Exchange.find(filterData)
        //     .populate({
        //         path: 'carId',
        //         model: 'car',
        //     })
        //     .skip(skip)
        //     .limit(limit)
        //     .sort({ createdDate: 'desc' });


        // console.log("exchangeData-length--", exchangeData.length)

        let filterData1 = {
            isActive: true,
            isDeleted: false,
            userId: mongoose.Types.ObjectId(partnerId)
        };
        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);
        const cars = await Car.aggregate([
            {
                $match: filterData1
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'cateDetails'
                }
            },
            {
                $lookup: {
                    from: 'exchanges',
                    localField: '_id',
                    foreignField: 'carId',
                    as: 'exchangeDetails'
                }
            }
        ])

        // console.log("cars", cars[1].exchangeDetails)
        // console.log("cars", cars.length)

        res.status(200).json({ data: cars });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}



/**
 * listExchangeBetween
 * @param req body
 * @returns json
 */
const listExchangeBetween = async (req, res) => {
    // console.log("from sendExchangeRequest---")
    // console.log("req.body---", req.body)
    let userId = req.id;
    if (req.params.partnerId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    let partnerId = req.params.partnerId
    console.log("userId", userId)
    console.log("partnerId", partnerId)
    try {

        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);

        let filterData = {
            isActive: true,
            isDeleted: false,

            $or: [
                {
                    $and: [
                        { requestSenderId: mongoose.Types.ObjectId(userId) },
                        { requestReceiverId: mongoose.Types.ObjectId(partnerId) }
                    ]
                },
                {
                    $and: [
                        { requestSenderId: mongoose.Types.ObjectId(partnerId) },
                        { requestReceiverId: mongoose.Types.ObjectId(userId) }
                    ]
                }
            ]
        };


        const exchangeData = await Exchange.find(filterData)
            .populate({
                path: 'carId',
                model: 'car',
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'desc' });

        res.status(200).json({ data: exchangeData });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}


/**
 * CheckActiveExchange
 * @param req body
 * @returns json
 */
const CheckActiveExchange = async (req, res) => {
    // console.log("from sendExchangeRequest---")
    // console.log("req.body---", req.body)
    let userId = req.id;
    if (req.params.partnerId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    let partnerId = req.params.partnerId
    console.log("userId", userId)
    console.log("partnerId", partnerId)
    try {

        let limit = 20;
        let page = req.query.page;
        let skip = (limit * page);

        let filterData = {
            isActive: true,
            isDeleted: false,
            finalisedExchange: false,
            $or: [
                {
                    $and: [
                        { requestSenderId: mongoose.Types.ObjectId(userId) },
                        { requestReceiverId: mongoose.Types.ObjectId(partnerId) }
                    ]
                },
                {
                    $and: [
                        { requestSenderId: mongoose.Types.ObjectId(partnerId) },
                        { requestReceiverId: mongoose.Types.ObjectId(userId) }
                    ]
                }
            ]
        };


        const exchangeData = await Exchange.find(filterData)
            .populate({
                path: 'carId',
                model: 'car',
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdDate: 'desc' });

        res.status(200).json({ data: exchangeData });
    } catch (err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}


export default { createExchange, listsExchangeRequest, listExchangeRequest, sendExchangeRequest, updateExchange, finalisedExchange, actualExchange, sendPastExchangeRequest, exchangeCarList, onlyMessage, listExchangeBetween, CheckActiveExchange, sendInterest }