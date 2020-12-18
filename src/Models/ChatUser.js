import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    roomId:{
        type: String,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    senderIsSeen: {
        type: Boolean,
        default: false
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    receiverIsSeen: {
        type: Boolean,
        default: false
    },
    message: {
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
    updatedDate: {
        type: Date
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const ChatUser = mongoose.model('chat_user',schema);
export default ChatUser;