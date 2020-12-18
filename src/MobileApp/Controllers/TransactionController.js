import User from '../../Models/User';
import Transaction from '../../Models/Transaction';
import config from '../../../config/config';
import moment from 'moment';


/**
 * TranscationCreate
 * Transaction create here
 * @param req body
 * return JSON
 */
const TranscationCreate = async (req, res) => {
    if (req.body.userId == null || req.body.transactionId == null || req.body.paymentID == null || req.body.amount == null || req.body.currency == null || req.body.paymentDuration == null || req.body.paymentDate == null|| req.body.paymentType == null) {
        return res.status(400).json({ msg: "Parameter missing!!!" });
    }
    try {
        const allData = req.body;
        const subscriptionNumber = Math.floor(Math.random() * 999999) + 100000;
        allData.subscriptionNumber = subscriptionNumber;
        allData.paymentType = req.body.paymentType;

        let subscriptionStartDate = moment(req.body.paymentDate).format('YYYY-MM-DD');
        let subscriptionExpireDate = moment(req.body.paymentDate, 'YYYY-MM-DD').add(1, 'years');
        subscriptionExpireDate = moment(subscriptionExpireDate).format('YYYY-MM-DD');
        let isSubscription=true;

        // console.log("subscriptionStartDate-----", subscriptionStartDate)
        // console.log("subscriptionExpireDate------", subscriptionExpireDate)
        // console.log("allData-----", allData)        

        const addCar = await new Transaction(allData).save();
        const updateUser = await User.findByIdAndUpdate(
            { _id: req.body.userId },
            {
                $set: { subscriptionStartDate: subscriptionStartDate, subscriptionExpireDate: subscriptionExpireDate,isSubscription: isSubscription, }
            }
        );
        // return
        res.status(200).json({ msg: "Transaction added successfully" });
    } catch (err) {
        console.log("Error => ", err.message);
        res.status(500).json({ msg: "Something went wrong." });
    }
}


export default { TranscationCreate}