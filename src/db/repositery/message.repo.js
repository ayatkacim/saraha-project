import * as base from "./base.repo.js"
import {models} from "../index.js"

let model= models.messageModel

export const findMessage = async({ where={} , check = false , select})=>{
    return await base.findOne({model , where , check , select})

}
export const findMessages = async({ where={} ,  limit , skip})=>{
    return await base.find({model, limit , skip})

}
export const createMessage = async({ data})=>{
    return await base.create({model ,data})
}
export const updateOneMessage = async({ data , where})=>{
    return await base.updateOne(model, where ,data, {returnDocument: "after"})
}