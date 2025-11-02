

export const env: any = {
    DB_PASSWORD: process.env.DB_PASSWORD??"null",
    DB_USER_NAME: process.env.DB_USER_NAME??"null",
    DB_NAME: process.env.DB_NAME??"null",
    JWT_SECRET: process.env.JWT_SECRET??"null",

    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID??"null",
    WHATSAPP_BUSINESS_ACCOUNT_ID: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID??"null",
    WHATSAPP_SYSTEM_USER_TOKEN: process.env.WHATSAPP_SYSTEM_USER_TOKEN??"null",

    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID??"null",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET??"null",
    RAZORPAY_WEBHOOK_SECRET:process.env.RAZORPAY_WEBHOOK_SECRET??"null",
    YOUR_RAZORPAY_VIRTUAL_ACCOUNT: process.env.YOUR_RAZORPAY_VIRTUAL_ACCOUNT??"null",
    
    PUBLIC_GOOGLE_MAPS_API_KEY:"null"
}

