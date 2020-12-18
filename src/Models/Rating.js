import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    },
    userType: {
        type: String,
        enum: ['Drive', 'Ride'],
        default: 'Ride'
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
const Rating = mongoose.model('rating',schema);
export default Rating;