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
    senderName: {
        type: String
    },
    senderImage: {
        type: String,
        default: "/image/user.png"
    },
    senderIsSeen: {
        type: Boolean,
        default: false
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    receiverName: {
        type: String
    },
    receiverImage: {
        type: String,
        default: "/image/user.png"
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
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const Chat = mongoose.model('chat',schema);
export default Chat;