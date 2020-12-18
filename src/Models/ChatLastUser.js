import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    lastUserId: {
        type: String,
    },
    updatedDate: {
        type: Date
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
const ChatLastUser = mongoose.model('chat_last_user',schema);
export default ChatLastUser;