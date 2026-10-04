import {config} from "dotenv"


//let envFilePath = process.env.NODE_ENV === "production"? ".env.production" :".env.development";
let envFilePath = `.env.${process.env.NODE_ENV}`;
config({path:envFilePath});


export default {
    port : Number(process.env.PORT),
    DB_URI :process.env.DB_URI,
    ENC_ALGO :process.env.ENC_ALGO,
    KEY: process.env.KEY,
    IV_LENGTH: Number(process.env.IV_LENGTH),
    USER_ACCESS_SECRET_KEY : process.env.USER_ACCESS_SECRET_KEY,
    USER_REFRESH_SECRET_KEY : process.env.USER_REFRESH_SECRET_KEY,
    ADMIN_ACCESS_SECRET_KEY : process.env.ADMIN_ACCESS_SECRET_KEY,
    ADMIN_REFRESH_SECRET_KEY : process.env.ADMIN_REFRESH_SECRET_KEY,
    HASH_SALT: Number(process.env.HASH_SALT)
}