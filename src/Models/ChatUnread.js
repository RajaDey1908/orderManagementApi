import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    unreadMessage: {
        type: Number
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
const ChatUnread = mongoose.model('chat_unread',schema);
export default ChatUnread;