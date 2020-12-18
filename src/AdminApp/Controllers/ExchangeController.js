import Car from '../../Models/Car';
import Exchange from '../../Models/Exchange';
import mongoose from 'mongoose';

/**
 * listsExchangeRequest
 * @param req body
 * @returns json
 */
const listsExchangeRequest = async(req, res) => {
    if(req.query.page == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        let filterData = {
            isActive: true,
            isDeleted: false
        };
        let limit = 20;
        let page = req.query.page;
        let skip = (limit*page);
        const exchangeData = await Exchange.aggregate([
            {
                $match: filterData
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'requestSenderId',
                    foreignField: '_id',
                    as: 'requestSenderDetails'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'requestReceiverId',
                    foreignField: '_id',
                    as: 'requestReceiverDetails'
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
    } catch(err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * listExchangeRequest
 * @param req body
 * @returns json
 */
const listExchangeRequest = async(req, res) => {
    if(req.params.exchangeId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        const exchangeData = await Exchange.findById({ 
            _id:req.params.exchangeId 
        })
        .populate({
            path:'requestSenderId requestReceiverId',
            model: 'user'
        })
        .populate({
            path:'carId',
            model: 'car'
        });
        const result = {
            exchange: exchangeData
        }
        res.status(200).json({ data: result });
    } catch(err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}

/**
 * updateExchangeRequest
 * @param req body
 * @returns json
 */
const updateExchangeRequest = async(req, res) => {
    if(req.params.exchangeId == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" })
    }
    try {
        const updateData = await Exchange.findByIdAndUpdate(
            { _id: req.params.exchangeId },
            {
                $set: req.body
            }
        )
        res.status(200).json({ data: "Updated successfully" });
    } catch(err) {
        console.log('Error => ', err.message);
        res.status(500).json({ msg: "Something went wrong.." });
    };
}
export default { listsExchangeRequest, listExchangeRequest, updateExchangeRequest }