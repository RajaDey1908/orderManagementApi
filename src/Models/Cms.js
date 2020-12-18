import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    cmsTitle: {
        type: String,
        required: true
    },
    cmsSlug: {
        type: String
    },
    cmsImage: {
        type: String
    },
    cmsContent: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});
const Cms = mongoose.model('cms',schema);
export default Cms;