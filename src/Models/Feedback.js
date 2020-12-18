import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car",
        required: true
    },
    exchangeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exchange",
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    comment: {
        type: String
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
const Feedback = mongoose.model('feedback', schema);
export default Feedback;