import mongoose from 'mongoose';
const { Schema } = mongoose;
// Creating user schema

const schema = new Schema({
    accessibilityTitle:{
      type: String, 
      required: true
    },
    accessibilityImage:{
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
const Accessibility = mongoose.model('accessibility', schema);
export default Accessibility;