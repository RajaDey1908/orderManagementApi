import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    transactionId: {
        type: String, 
        required: true
    }, 
    paymentID: {
        type: String, 
        required: true
    },
    paymentType: {
        type: String, 
        required: true
    },
    amount: {
        type: Number, 
        required: true
    },
    paymentToken: {
        type: String
    },
    currency: {
        type: String,
        default: 'usd', 
        required: true
    },
    paymentDuration: {
        type: Number, 
        required: true
    },
    paymentDate: {
        type: String, 
        required: true
    },
    PaymentMethod: {
        type: String
    },    
    subscriptionNumber:{
        type: String, 
        required: true
    }, 
    PaymentStatus: {
        type: Boolean,
        default: true
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
    },
});
const Transaction = mongoose.model('transaction', schema);
export default Transaction;