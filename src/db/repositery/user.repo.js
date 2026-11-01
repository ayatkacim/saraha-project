import * as base from "./base.repo.js"
import {models} from "../index.js"

let model= models.userModel

export const findUser = async({ where={} , check = false , select})=>{
    return await base.findOne({model , where , check , select})

}
export const findUsers = async({ where={} ,  limit , skip})=>{
    return await base.find({model, limit , skip})

}
export const createUser = async({ data})=>{
    return await base.create({model ,data})
}
export const updateOneUser = async({ data , where})=>{
    return await base.updateOne(model, where ,data, {returnDocument: "after"})
}