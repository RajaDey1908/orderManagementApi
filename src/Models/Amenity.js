import mongoose from 'mongoose';
const { Schema } = mongoose;
// Creating user schema

const schema = new Schema({
    amenityTitle:{
      type: String, 
      required: true
    },
    amenityImage:{
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
const Aminity = mongoose.model('aminity', schema);
export default Aminity;