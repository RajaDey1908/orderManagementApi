import Rating from '../../Models/Rating';
import Feedback from '../../Models/Feedback';

/**
 * createRating
 * Here add createRating
 * return JSON
 */
const createRating = async(req, res) => {
    try {
        let allData = req.body;
        const addData = new Rating(allData).save();
        res.status(200).json({ msg:"Rating added successfully" });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}

/**
 * listRating
 * Here get rating details
 * return JSON
 */
const listRating = async(req, res) => {
    if(req.params.ratingId == null) {
        return res.status(400).json({ msg:"Parameter missing..." });
    }
    try {
        const ratingData = await Rating.findById({ _id: req.params.ratingId }).populate({
            path:'senderId receiverId',
            model: 'user',
            select: 'name email address profilePicture'});
        res.status(200).json({ data:ratingData });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}

/**
 * updateRating
 * Here update rating details
 * return JSON
 */
const updateRating = async(req, res) => {
    if(req.params.ratingId == null) {
        return res.status(400).json({ msg:"Parameter missing..." });
    }
    try {
        const editData = await Rating.findByIdAndUpdate(
            { _id: req.params.ratingId },
            {
                $set: {
                    rating: req.body.rating,
                    comment: req.body.comment,
                    isActive: req.body.isActive
                }
            });
        res.status(200).json({ msg:"Rating updated successfully" });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}

/**
 * listRatings
 * Here get all rating
 * return JSON
 */
const listRatings = async(req, res) => {
    try {
        const allData = await Rating.find({ isDeleted: false }).populate({
            path:'senderId receiverId',
            model: 'user',
            select: 'name email address profilePicture'});
        res.status(200).json({ data:allData });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}

/**
 * deleteRating
 * Here delete rating Rating
 * return JSON
 */
const deleteRating = async(req, res) => {
    if(req.params.ratingId == null){
        return res.status(400).json({ msg:"Parameter missing..." })
    }
    try {
        const updateData = await Rating.findByIdAndUpdate(
            { _id: req.params.ratingId },
            {
                $set: {
                    isDeleted: true
                }
            });
        res.status(200).json({ msg:"rating Rating has been deleted" });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}

/**
 * listFeedbacks
 * Here get all Feedback
 * return JSON
 */
const listFeedbacks = async(req, res) => {
    try {
        const allData = await Feedback.find({ isDeleted: false }).populate({
            path:'userId',
            model: 'user',
            select: 'name email address profilePicture'});
        res.status(200).json({ data:allData });
    } catch (err) {
        console.log('Error => ',err.message)
        res.status(500).json({ msg:"Something went wrong" });
    }
}
export default { createRating, listRating, updateRating, listRatings, deleteRating, listFeedbacks };