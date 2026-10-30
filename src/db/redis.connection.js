import { createClient } from "redis";
import config from "./../config/config.service.js"

export const redisClient = createClient({
    url: config.REDIS_URI
})

export const redisConnection = async() => {
    try {
        await redisClient.connect()
        console.log("redis connected")
    }catch(e){
        console.log(e)
        throw(e)
    }
}