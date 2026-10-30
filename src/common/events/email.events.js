import { EventEmitter } from "node:events";
import { sendEmail } from "../services/mail.service.js"
import { emailTemplate } from "../templates/templates.js";
import { eventsEnum } from "../enum/events.enum.js";


export let eventEmitter = new EventEmitter()


eventEmitter.on(eventsEnum.signup , async ({recipients , otp})=>{
    try{
        await sendEmail({
            recipients,
            subject: "Welcome to Saraha app",
            html: emailTemplate({
            title:"Email Verification",
            message :`your OTP is`,
            otp,
            expiresIn :"5 minutes"
        })
        })
    }catch(e){
        console.log(e.message)
        console.log(e)
    }
})

eventEmitter.on(eventsEnum.forget , async ({recipients , otp})=>{
    try{
        await sendEmail({
            recipients,
            subject: "Forget Password Otp",
            html: emailTemplate({
            title:"Email Verification",
            message :`your OTP to reset your password is:`,
            otp,
            expiresIn :"5 minutes"
        })
        })
    }catch(e){
        console.log(e.message)
        console.log(e)
    }
})