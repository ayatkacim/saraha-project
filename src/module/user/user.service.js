
import {verfiyToken , enums} from "../../common/index.js"
import { models, Queries } from "../../db/index.js"
//import {unAuthorizedException} from "../../common/exceptions/index.js"


export const getUserById = async (userId ) => {
    let user= await Queries.findOne({
        model: models.userModel,
        where: {_id : userId},
        select: "-password -confirmEmail -__v -role -provider"
    })

    return user;

} 

export const getAllUsers = async (page,limit)=> await Queries.find({model : models.userModel , limit:limit , skip:(page-1)*limit })





