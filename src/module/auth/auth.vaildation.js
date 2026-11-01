import {z} from "zod"

import { GF , enums } from "../../common/index.js"
import authorization from "../../common/middleware/authorization.js"


let loginBody =(lang)=> z.strictObject({
    email: GF.email(lang),
    password: GF.password(lang)
})

export let loginSchema =(lang)=> z.object({
    body: loginBody(lang),
    //headers:GF.headers(lang)
})

//lw 3amel refine fe login schema use safe extend 

let signupBody = (lang)=> loginBody(lang).safeExtend({
    confirmPassword:GF.confirmPassword(lang),
    phone : GF.phone(lang),
    fullName: GF.fullName(lang),
    gender: GF.gender(lang),
    DOB:GF.DOB(lang)  //must be date object 
    //scores:z.array(z.number()).nonempty()   
}).superRefine((data , ctx)=>{
    if(data.confirmPassword != data.password){
        ctx.addIssue({
            code:"custom",
            path:["confirmPassword"],
            message:"password not match confirm password"
        })
    }


    // if(data.fullName == "admin"){
    //     ctx.addIssue({
    //         code:"invalid_value",
    //         path:["fullName"],
    //         message:"you add invaild value"
    //     })
    // }

    //     .refine((value)=>{
    //     return value.password === value.confirmPassword
    // }, { message:"password not match confirm password" , path:["confirmPassword"]})

})

export let signupSchema =(lang)=> z.object({
    body:signupBody(lang),
    file:GF.file(lang)
})

export let rotateTokenSchema =(lang)=> z.object({
    headers:GF.headers(lang)

})