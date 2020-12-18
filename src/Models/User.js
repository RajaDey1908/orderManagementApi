import mongoose from 'mongoose';
const { Schema } = mongoose;
// Creating user schema

const schema = new Schema({
    name:{
      type: String, 
      required: true
    },
    username:{
        type: String
    },
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    email: {
        type: String,
    },  
    password: {
        type: String
    },                 
    phoneNumber: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    aboutMe: {
        type: String
    },
    // profilePicture: {
    //     type: String, 
    //     default: "/image/user.png"
    // },
    profilePicture: [
        {
            image: { type: String },
        }
    ],
    spokenLanguage: [
        {
            name:{type: String},
            shortCode:{type: String}
        }
    ],
    traveller: [
        {
            name:{type: String},
            age:{type: String},
            occupation:{type: String}
        }
    ],
    preferredDestination: [
        {
            city:{type: String},
            date:{type: String},
            description:{type: String}
        }
    ],
    // preferredDestination: {
    //     type: String
    // },
    group: [
        {
            name: {type: String},
            icon: {type: String}
        }
    ],
    club: {
        type: String
    },
    locationName: {
        type: String
    },
    location: {
        type: { type: String, default: "Point" },
        coordinates: [ ] //[<longitude>, <latitude>]
    },
    hobby: {
        type: String
    },
    otp: {
        type: String
    },
    socialId: {
        type: String
    },
    socialType: {
        type: String,
        enum: ['Facebook','WeChat','Google']
    },
    isSocialLogin: {
        type: Boolean,
        default: false
    },
    deviceType: {
        type: String
    },
    deviceToken: {
        type: String
    },
    countryCode: {
        type: String
    },
    bankAccountHolderName: {
        type: String
    },
    bankAccountEmail: {
        type: String
    },
    bankName: {
        type: String
    },
    bankAccountNumber: {
        type: String
    },
    routingNumber: {
        type: String
    },
    stripeBankId: { //when user create an account in stripe
        type: String
    },
    stripeCustomerId: {
        type: String
    },
    cardNumber: {
        type: String
    },
    cardTokenId: {
        type: String
    },
    bankVerified: {
        type: Boolean, 
        default: false
    },
    cardVerified: {
        type: Boolean, 
        default: false
    },
    isNotification: {
        type: Boolean,
        default: true
    },
    isMembershipPlan: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean, 
        default: false
    },
    isPhoneVerified: {
        type: Boolean, 
        default: false
    },
    isGovtIdVerified: {
        type: Boolean, 
        default: false
    },
    isDrivingLicenceVerified: {
        type: Boolean, 
        default: false
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
    },     
    lastLogin: {
        type: Date
    },
    isLogout: {
        type: Boolean,
        default: true
    },                                   
    isAdmin: {
        type: Boolean, 
        default: false
    },
    subscriptionStartDate: {
        type: String
    },
    subscriptionExpireDate: {
        type: String
    },
    isSubscription: {
        type: Boolean, 
        default: false
    },     
});
schema.index({ "location": "2dsphere" });
const User = mongoose.model('user', schema);
export default User;