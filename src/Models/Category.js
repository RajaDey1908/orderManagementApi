import mongoose from 'mongoose';
const { Schema } = mongoose;

const schema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryImage: {
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
const Category = mongoose.model('category',schema);
export default Category;