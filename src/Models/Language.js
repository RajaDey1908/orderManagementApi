import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortCode: {
        type: String
    },
    logo: {
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
const Language = mongoose.model('language',schema);
export default Language;