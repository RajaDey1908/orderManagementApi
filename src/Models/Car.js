import mongoose from 'mongoose';
const { Schema } = mongoose;
// Creating user schema

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    brand: {
        type: String
    },
    color: {
        type: String
    },
    model: {
        type: String
    },
    seat: {
        type: Number
    },
    year: {
        type: Number
    },
    mileage: {
        type: Number
    },
    // carImage: {
    //     type: String,
    //     // default:"/image/SONATA-hero-option1-764A5360-edit.jpg"
    //     default:"/image/default.jpg"
    // },
    carImage: [
        {
            image: { type: String },
        }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    // amenity: [
    //     {
    //         amenityId: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "amenity"
    //         },
    //         amenityTitle: { type: String },
    //         amenityImage: { type: String }
    //     }
    // ],
    accessibility: [
        {
            accessibilityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "accessibility"
            },
            accessibilityTitle: { type: String },
            accessibilityImage: { type: String }
        }
    ],
    locationName: {
        type: String
    },
    province: {
        type: String
    },
    location: {
        type: { type: String, default: "Point" },
        coordinates: [] //[<longitude>, <latitude>]
    },
    carRegistrationId: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    isAdminVerified: {
        type: Boolean,
        default: false
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
schema.index({ "location": "2dsphere" });
const Car = mongoose.model('car', schema);
export default Car;