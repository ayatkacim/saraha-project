import { BadRequestException, NotFoundException } from "../../common/exceptions/index.js"

export const findOne = async({model , where={} , check = false , select})=>{
    if(!model) BadRequestException("model not provided")
    let data = await model.findOne(where).select(select) //mongoose
    if (!data && !check) NotFoundException("Target Document not Found!")
        return data
    // let query=`SELECT from ${model} WHERE ${where}`    //sql

}
export const find = async({model , where={} ,  limit , skip})=>{

    if(!model) BadRequestException("model not provided")
    let data = await model.find(where).skip(skip).limit(limit)//mongoose
    //if (!data && !check) NotFoundException("Target Document not Found!")
        return data
    // let query=`SELECT from ${model} WHERE ${where}`    //sql

}

export const create = async({model, data})=>{
    return await model.create(data)
}

export const updateOne = async({model, data , where})=>{
    return await model.updateOne(where ,data, {returnDocument: "after"})
}