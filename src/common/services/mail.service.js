import {createTransport} from "nodemailer"
import configService from "../../config/config.service.js"
import {resolve} from "node:path"


let transporter =  createTransport({
    service : "gmail",
    auth:{
        user : configService.APP_EMAIL,
        pass : configService.APP_PASSWORD
    }
})



export const sendEmail  = async ({
    recipients,
    subject,
    html,
    text,
    attachments

})=>{
    let info = await transporter.sendMail({
    from : `sarah project <${configService.APP_EMAIL}>`,
    ...recipients,
    subject ,
    text,
    html,
    attachments 
})
    console.log(info)
}