import mongoose from "mongoose";
import config  from "../config/config.service.js"
import {redisConnection} from "./redis.connection.js"




export default async ()=>{
    try {
        await mongoose.connect(config.DB_URI)
        console.log("DB connected")
        await redisConnection()
    } catch (error) {
        console.log(error)
    }


}