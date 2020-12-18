import mongoose from 'mongoose';
const { Schema } = mongoose;
// Creating user schema

const schema = new Schema({
    requestSenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    requestReceiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "car",
        required: true
    },
    arrivalDate: {
        type: String
    },
    departureDate: {
        type: String
    },
    toBeDetermined: {
        type: Boolean,
        default: false
    },
    readyForExchange: {
        type: Boolean,
        default: false
    },
    guest: {
        type: Number
    },
    exchangeType: {
        type: String
    },
    drivingType: {
        type: String
    },
    exchangeMessage: {
        type: String
    },
    exchangeStatus: {
        type: String,
        enum: ['O', 'A', 'R', 'C'],   //'O'=>Open,'A'=>Accept,'R'=>Reject,'C'=>Complete
        default: 'O'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    finalisedExchange: {
        type: Boolean,
        default: false
    },
    actualExchange: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
const Exchange = mongoose.model('exchange', schema);
export default Exchange;