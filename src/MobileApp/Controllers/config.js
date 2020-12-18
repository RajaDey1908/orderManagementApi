const defaultData = {
    SECRET_KEY: 'secretkey',
    EXPIRES_IN: '30d', // expires in 30 days
    SALT_ROUND: 10,
    JWT_ALGORITHM: 'HS256',
    HOST_EMAIL: 'mail@cbnits.com',
    HOST_EMAIL_PASSWORD: 'w#llcbn1ts',
    FORGOT_PASSWORD: '5ed7568c903ba14d3a752e00',
    OTP_TEMPLATE_PRIMARY_ID: "5edddf951538ebdd7072a48f",
    CONTACT_US_PRIMARY_ID: "5ee77a1dccd5ccbc8c5408d5",
    SETTING_PRIMARY_ID: '5ed79658b4272f9b0afa9148',
    // BASE_URL: 'http://127.0.0.1:4020',
    DATABASE_URI: 'mongodb+srv://sourav:sourav@cluster0-kmrns.mongodb.net/carexchange?retryWrites=true&w=majority',
    IMAGE_PATH: '/image/',
    USER_IMAGE_PATH: '/userImage/',
    CATEGORY_IMAGE_PATH: '/categoryImage/',
    LOGO_IMAGE_PATH: '/logo/',
    CAR_IMAGE_PATH: '/carImage/',
}
  
export default defaultData;