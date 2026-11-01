import configService from "../../config/config.service.js"
import jwt from "JsonWebToken"
import crypto from "crypto"
import {userRepo as ur} from "../../db/index.js"
import {enums} from "../index.js"
import {exists, set , get} from "../services/cache.service.js"
import {unAuthorizedException} from "../exceptions/index.js"
import { getUserKey } from "../../module/auth/auth.service.js"


const getTokenSecretsForRole = (role) => {
    let secrets
    switch (role) {
        case enums.roleEnum.admin:
            secrets = { access: configService.ADMIN_ACCESS_SECRET_KEY, refresh: configService.ADMIN_REFRESH_SECRET_KEY }
            break

        case enums.roleEnum.user:
            secrets = { access: configService.USER_ACCESS_SECRET_KEY, refresh: configService.USER_REFRESH_SECRET_KEY }
            break

        default:
            ServerException("Unhandled role")
    }

    return secrets
}

export function getPrefixRevoke (userId){
    return `RevokeToken::${userId}}`
}

export function getRevokeKey (userId,jti){
    return `${getPrefixRevoke(userId)}::${jti}`
}



export const createTokens = ({userId , issuer , role= enums.roleEnum.user})=>{
    let secrets = getTokenSecretsForRole(role)
    let jwtid = crypto.randomUUID()
    return {
            accessToken: jwt.sign({
            
                sub : userId
                }, secrets.access,
                {
                    expiresIn:configService.ACCESS_EX,
                    //notBefore: "10m" ,
                    issuer ,
                    audience:[role],
                    jwtid: jwtid
                   // jwtid: jti.toString()
                   // issuer:   
                }),
            refreshToken:  jwt.sign({
            
                sub : userId
                }, secrets.refresh,
                {
                    expiresIn:configService.REFRESH_EX,
                    //notBefore: "10m" ,
                    issuer ,
                    audience:[role],
                    jwtid:jwtid
                    //jwtid: jti.toString() + "0"
                   // issuer:   
                })
    }
}


export const verfiyToken = async (token, tokenType) => {
    let decoded = jwt.decode(token)
    if(await exists({key : getRevokeKey(decoded.sub,decoded.jti)})){
        unAuthorizedException("you are already logged out")
    }
    let secret = getTokenSecretsForType(tokenType, decoded.aud[0])
    let verify = jwt.verify(token, secret)
    if (await exists({ key: getUserKey(decoded.sub) })) {
        console.log("cached")
        return await get({ key: getUserKey(decoded.sub) })
    }
    let user = await ur.findUser({ where: { _id: verify.sub } })
    if(user.changedAt && decoded.iat < user.changedAt){
        unAuthorizedException("you are already logged out")
    }
    await set({ key: getUserKey(decoded.sub), value: user, ttl: 30 })
    return user
}

const getTokenSecretsForType = (tokenType , role)=>{
    let secrets = getTokenSecretsForRole(role)
    let secret = null
    switch(tokenType){
        case enums.tokenTypesEnum.access:
            secret = secrets.access
            break;

        default :
            secret = secrets.refresh
    }
    return secret 
}