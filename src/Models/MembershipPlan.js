import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    planTitle: {
        type: String,
        required: true
    },
    planDescription: {
        type: String
    },
    planDuration: {
        type: Number,
        required: true
    },
    planPrice: {
        type: Number,
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
const MembershipPlan = mongoose.model('membership_plan',schema);
export default MembershipPlan;