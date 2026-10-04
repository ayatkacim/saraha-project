import { BadRequestException, NotFoundException } from "../../common/exceptions/index.js"

export const findOne = async({model , where={} , check = false})=>{

    if(!model) BadRequestException("model not provided")
    let data = await model.findOne(where) //mongoose
    if (!data && !check) NotFoundException("Target Document not Found!")
        return data
    // let query=`SELECT from ${model} WHERE ${where}`    //sql

}


export const find = async({model , where={} , check = false})=>{

    if(!model) BadRequestException("model not provided")
    let data = await model.find(where) //mongoose
    //if (!data && !check) NotFoundException("Target Document not Found!")
        return data
    // let query=`SELECT from ${model} WHERE ${where}`    //sql

}



export const create = async({model, data})=>{
    return await model.create(data)
}