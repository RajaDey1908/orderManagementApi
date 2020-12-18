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
    favouriteBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },    
    roomId:{
        type: String,
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
const ChatFavourite = mongoose.model('chat_favourite',schema);
export default ChatFavourite;