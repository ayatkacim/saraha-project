import configService from "../../config/config.service.js"
import jwt from "JsonWebToken"
import { Queries , models } from "../../db/index.js"
import {enums} from "../index.js"


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
export const createTokens = ({userId , issuer , role= enums.roleEnum.user})=>{
    let secrets = getTokenSecretsForRole(role)
    return {
            accessToken: jwt.sign({
            
                sub : userId
                }, secrets.access,
                {
                    expiresIn:"6h",
                    //notBefore: "10m" ,
                    issuer ,
                    audience:[role],
                   // jwtid: jti.toString()
                   // issuer:   
                }),
            refreshToken:  jwt.sign({
            
                sub : userId
                }, secrets.refresh,
                {
                    expiresIn:"1d",
                    //notBefore: "10m" ,
                    issuer ,
                    audience:[role],
                    //jwtid: jti.toString() + "0"
                   // issuer:   
                })
    }
}


export const verfiyToken = async (token, tokenType) => {
    let {aud} = jwt.decode(token)
    let secret = getTokenSecretsForType(tokenType , aud[0])
    let verfiy = jwt.verify(token, secret)
    let user = await Queries.findOne({model: models.userModel, where: {_id: verfiy.sub}})
    
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