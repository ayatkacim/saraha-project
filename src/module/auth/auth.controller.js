import { Router } from "express";
import { response } from "../../common/utiltes/index.js";
import * as as from "./auth.service.js"
let authRouter = Router()

authRouter.post("/signup",async (req, res, next)=>{
    let user = await as.createUser(req.body)

    response({
        res,
        data:user,
        status:201,
        message:"user created"
    })

})

authRouter.post("/login",async (req, res, next)=>{
    let issuer = `${req.protocol}://${req.host}`
    let tokens = await as.login(req.body , issuer)

    response({
        res,
        data:tokens,
        message:"user loged in"
    })

})

authRouter.get("/rotate-token", async (req, res)=>{
    let issuer = `${req.protocol}://${req.host}`
    let tokens = await as.rotateToken(req.headers.authorization , issuer)

    return response({
        data: tokens ||{},
        status : 200,
        message :  "Token Rotated " ,
        res
    })

})

export default authRouter