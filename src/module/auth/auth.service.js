
import { exceptions , verfiyToken , createTokens , myHash ,myCompare, enums, encrypting} from "../../common/index.js"
import {models , Queries} from "../../db/index.js"
import jwt from "jsonwebtoken"
import {del, exists, get, keys, set , incr} from "../../common/services/index.js"
import configService from "../../config/config.service.js"
import { getPrefixRevoke, getRevokeKey } from "../../common/utiltes/token.service.js"
import { eventEmitter } from "../../common/events/email.events.js"
import crypto from "node:crypto"
import { BadRequestException } from "../../common/exceptions/index.js"

const MAX_SEND_RETRIES =configService.MAX_SEND_RETRIES
const MAX_OTP_RETRIES =configService.MAX_OTP_RETRIES



export const getUserKey = userId=> `user::${userId.toString()}`
export const getUserSendKey = userId=> `send::${getUserKey(userId)}`
export const getUserOTPKey = userId=> `OTP::${getUserKey(userId)}`
export const getUserOTPForgetKey = userId=> `OTP::forget::${getUserKey(userId)}`
export const getUserOTPTriesKey = userId=> `tries::${getUserKey(userId)}`

export const createUser = async (data)=>{
    let exists = await Queries.findOne({ model: models.userModel, where: { email: data.email } , check:true })
    if(exists) throw exceptions.ConflictException("this user already exist")
    let user = await Queries.create({model:models.userModel , data:{...data, phone: data.phone ? encrypting(data.phone) : null ,DOB : new Date(data.DOB), password: await myHash(data.password)}})
    let otp = crypto.randomInt(100000 , 1000000)
    set({
        key: getUserOTPKey(user._id),
        value:otp,
        ttl: 5*60
    })
    eventEmitter.emit(enums.eventsEnum.signup, {
        recipients: { to: data.email }, 
        otp  })

    await createAndSendOtp({
        event:enums.eventsEnum.signup,
        email:data.email,
        key :getUserOTPKey(user._id)
    })
    return user || {}
}

export const confirmEmail =async ({otp,email})=>{
    let user = await Queries.findOne({
        model : models.userModel,
        where : {email}
    })

    await blockUser(user._id)
    let redisOtp = await get({key :getUserOTPKey(user._id) })
    console.log({ redisOtp, otp, key: getUserOTPKey(user._id) })
    if(redisOtp == otp){
        await user.updateOne({$set:{confirmEmail:true}})
        await del({keys : [getUserOTPKey(user._id)]})
        return user
    }else{
        await wrongOtpHandler(user._id)
    }
}

export const resendOtp = async ({ email, topic }) => {
    let user = await Queries.findOne({
        model: models.userModel,
        where: { email }
    })

    switch (topic) {
        case "signup":
            const key = getUserSendKey(user._id)
            if (await exists({ key: getUserOTPKey(user._id) })) {
                BadRequestException("can't send new otp while old one is active")
            }

            let times = await get({key })
            if (times){
                if(times == MAX_SEND_RETRIES){
                    BadRequestException(`you reach your limit please try after ${await ttl({key}) /60 } minutes `)
                }else{
                    await incr({key})
                }
            }
            else{
                await set({key , value:1 , ttl:9000})
            }

            await set({key: getUserSendKey(user._id) , value: 1 , ttl:5*60})
            let otp = crypto.randomInt(99999, 1000000)
            await set({
                key: getUserOTPKey(user._id),
                value: otp,
                ttl: 5 * 60
            })
            eventEmitter.emit(enums.eventsEnum.signup, { recipients: { to: email } , otp })
            break;
    }
    return `new otp sent for ${topic}`
}

export const login = async (where , issuer)=>{
    let {email , password} = where
    let user = await Queries.findOne({model: models.userModel , where:{email}})
    //let user = await userModel.findOne(data)
    console.log(user)
    if(!user || !await myCompare({plainText: password , hashedText: user.password})) throw exceptions.NotFoundException("user not Found")
        //throw new Error("user not found", {cause:404})
    let jti= Math.ceil(Math.random()*1000)
    
    let tokens = createTokens({
        userId: user._id,
        role : user.role,
        issuer:issuer
    })
    
        return tokens
    
}

export const loginWithGmail = async ({ idToken }, issuer) => {
    let payload = await verifyGoogleId(idToken)
    console.log(payload)
    let { email, given_name, family_name, picture } = payload
    let user = await findOne({ model: userModel, where: { email }, check: true })
    if (user) {
        let tokens = createTokens({
            userId: user._id, issuer
        })
        return { tokens, status: 200 }
    }

    user = await Queries.create({
        model: models.userModel, data: {
            email, firstName: given_name, lastName: family_name, image: picture, provider: enums.providerEnum.google , confirmEmail:true
        }
    })

    let tokens = createTokens({
        userId: user._id, issuer
    })
    return { tokens, status: 201 }
}

export const logout = async (auth , type)=>{
    let [ bearer , token] = auth.split(" ")
    switch (type) {
        case enums.logoutEnum.all:
            let data = jwt.decode(token)
            await Queries.updateOne({
                model:models.userModel,
                data:{changedAt : Math.ceil(Date.now()/1000)},
                where : {_id : data.sub}
            })
            await del({keys: [getUserKey(data.sub)] })
            let arr = await keys({prefix :getPrefixRevoke(data.sub)})
            await del({keys:arr})
            break;
    
        default:
            
            await revokeToken (token)   
            break;
    }
    

}

const revokeToken = async (token)=>{
    
    let data = jwt.decode(token)
    let nowSec = Math.ceil(Date.now() / 1000)
    let iat = nowSec - data.iat
    let ttl = configService.REFRESH_EX- iat 
    console.log({res :iat + configService.REFRESH_EX})
    set({key : getRevokeKey(data.sub , data.jti) , value : 1 , ttl })

}

export const rotateToken = async (refreshToken , issuer)=>{
    let user = await verfiyToken(refreshToken, enums.tokenTypesEnum.refresh)
    let tokens = createTokens({userId: user._id , issuer , role:user.role})
    await revokeToken(refreshToken)
    return tokens
    
}

export const forgetPassword= async({email})=>{
    let user = await Queries.findOne({
        model : models.userModel ,
        where :{ email }
    })
    await user.updateOne({
        $set: {
            changedAt: Date.now()
        }
    })
    let arr = await keys({ prefix: getPrefixRevoke(user._id) })
    arr.length && await del({keys:arr})
    createAndSendOtp({
        event:enums.eventsEnum.forget,
        email,
        key:getUserOTPForgetKey(user._id)
    })
    return "done"
}

export const resetPassword = async ({ email, otp, newPassword }) => {
    let user = await Queries.findOne({
        model: models.userModel,
        where: { email }
    })
    await blockUser(user._id)
    let redisOtp = await get({ key: getUserOTPForgetKey(user._id) })
    if (!redisOtp) {
        NotFoundException("otp not found")
    }

    if (redisOtp == otp) {
        await user.updateOne({
            $set: {
                password: await myHash(newPassword),
                changedAt: Date.now()
            }
        })
        return "user password changed"
    } else {
        await wrongOtpHandler(user._id)
    }
}

const wrongOtpHandler = async(userId)=>{
    let key = getUserOTPTriesKey(userId)
        if (await exists({ key })) {
            await incr({ key })
        } else {
            await set({ key, value: 1, ttl: 600 })
        }
        BadRequestException("Wrong otp")
}


const blockUser = async(userId)=>{
    let userOTPRetries = await get({ key: getUserOTPTriesKey(userId) })
    if (userOTPRetries && userOTPRetries == MAX_OTP_RETRIES) {
        del({ keys: [getUserOTPKey(userId)] })
        BadRequestException(`try again after ${Math.ceil(await ttl({ key: getUserOTPTriesKey(userId) }) / 60)} minutes`)
    }
}

const createAndSendOtp = async({event , email , key})=>{
    let otp = crypto.randomInt(99999, 1000000)
    set({
        key,
        value: otp,
        ttl: 5 * 60
    })
    eventEmitter.emit(event, { recipients: { to:email }, otp })
}