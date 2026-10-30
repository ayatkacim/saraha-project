import { Router } from "express";
import { response } from "../../common/utiltes/index.js";
import * as us from "./user.service.js"
import * as uv from "./user.vaildation.js"
import { decrypting, middleware } from "../../common/index.js";
import { roleEnum } from "../../common/enum/role.enum.js";
import { vaildator } from "../../common/middleware/vaildator.js";
let userRouter = Router()
let cache ={}


userRouter.get("/",middleware.auth,middleware.authorization(roleEnum.user) ,async (req, res)=>{
    //let user = await us.getUserById(req.headers.authorization)
    req.user.phone= decrypting(req.user.phone)
    return response({
        data: req.user ||{},
        status : 200 ,
        message : "user Fetched " ,
        res
    })

})

userRouter.get("/profile/:userId",vaildator(uv.getUserByIdSchema),middleware.auth ,async (req, res)=>{
    let userId =req.vaildate.params.userId
    let data={}
    if(cache.userId != undefined){
        data = cache.userId

    }else{
        let data = await us.getUserById(userId)
        cache.userId=data
    }
    
    if(req.vaildate.query.phone){
        data.phone = decrypting(data.phone)
    }
    
    return response({
        data: cache.userId ||{},
        status : 200 ,
        message : "user Fetched " ,
        res
    })
    

})


userRouter.get("/all",middleware.auth,vaildator(uv.paginationSchema) ,middleware.authorization(roleEnum.admin) ,async (req, res)=>{
    let {page,limit}= req.vaildate.query
    let users = await us.getAllUsers(page,limit)

    return response({
        data: users,
        status : 200 ,
        message : "users Fetched " ,
        res
    })

})



userRouter.get("/rotate-token", async (req, res)=>{
    let user = await us.rotateToken(req.headers.authorization)

    return response({
        data: user ||{},
        status : user? 200 : 404,
        message : user? "user Fetched " : " user not found",
        res
    })

})


export default userRouter