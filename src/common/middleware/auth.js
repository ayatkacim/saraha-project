import { models } from "../../db/index.js"
import { findOne } from "../../db/repositery/base.repo.js"
import { BadRequestException, NotFoundException, unAuthorizedException } from "../exceptions/index.js"
import { enums, myCompare } from "../index.js"
import { verfiyToken } from "../utiltes/index.js"

export default async (req, res, next) => {
    let authorization = req.headers.authorization
    if (!authorization) unAuthorizedException("auth users only")
    let [prefix, token]= authorization.split(" ")
    console.log({prefix, token})

    switch(prefix){
        case enums.authEnum.Basic:
            let data = Buffer.from(token , "base64").toString()
            let [email , password] = data.split(":")
            let user = await findOne({model: models.userModel , where : {email}})
            let check = myCompare({plainText : password , hashedText:user.password})
            if(!check) NotFoundException("user not found")
            
            req.user = user
            next()
            break;
        
        case enums.authEnum.Bearer:
            req.user = await verfiyToken(token, enums.tokenTypesEnum.access)
            next()
            break;
        
        default:
            BadRequestException("invaild Auth Type")

    }
    
}