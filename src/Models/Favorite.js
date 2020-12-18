import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    carUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const Favorite = mongoose.model('favorite',schema);
export default Favorite;