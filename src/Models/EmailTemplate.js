import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    emailSubject: {
        type: String,
        required: true
    },
    emailContent: {
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
const EmailTemplate = mongoose.model('email_template',schema);
export default EmailTemplate;