import { Router } from "express";
import { response } from "../../common/utiltes/index.js";
import * as us from "./user.service.js"
import { decrypting, middleware } from "../../common/index.js";
import { roleEnum } from "../../common/enum/role.enum.js";
let userRouter = Router()

userRouter.get("/",middleware.auth ,async (req, res)=>{
    //let user = await us.getUserById(req.headers.authorization)
    req.user.phone= decrypting(req.user.phone)
    return response({
        data: req.user ||{},
        status : 200 ,
        message : "user Fetched " ,
        res
    })

})


userRouter.get("/all",middleware.auth, middleware.authorization(roleEnum.admin) ,async (req, res)=>{
    let users = await us.getAllUsers()

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