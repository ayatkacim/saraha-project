
import {verfiyToken , enums} from "../../common/index.js"
import { models, Queries } from "../../db/index.js"
//import {unAuthorizedException} from "../../common/exceptions/index.js"


export const getUserById = async (token ) => {
    return await verfiyToken(token , enums.tokenTypesEnum.access)

} 

export const getAllUsers = async ()=> await Queries.find({model : models.userModel})





