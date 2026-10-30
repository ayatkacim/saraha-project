import { Router } from "express";
import { response } from "../../common/utiltes/index.js";
import { middleware } from "../../common/index.js";
import * as as from "./auth.service.js"
import * as av from "./auth.vaildation.js"
import auth from "../../common/middleware/auth.js";

let {vaildator} = middleware
let authRouter = Router()

authRouter.post("/signup",vaildator(av.signupSchema), async (req, res, next)=>{
    //req.body.DOB = new Date(req.body.DOB)
    // let {success, error , data} = av.signupSchema.safeParse(req.body)
    // if(!success){
    //     return res.status(400).json({
    //         message:"validation error",
    //         issues: error.issues
    //     })
    // }
    let user = await as.createUser(req.vaildate.body)

    response({
        res,
        data:user,
        status:201,
        message:"user created"
    })

})

authRouter.post("/confirmEmail", async (req, res, next)=>{
    let user = await as.confirmEmail(req.body)

    response({
        res,
        data:user,
        status:200,
        message:"Email Confirmed"
    })

})


authRouter.post("/resendOtp", async (req, res, next)=>{
    let message = await as.resendOtp(req.body)

    response({
        res,
        status:200,
        message
    })

})

authRouter.post("/forgetPassword", async (req, res, next)=>{
    let message = await as.forgetPassword(req.body)

    response({
        res,
        message
    })

})

authRouter.post("/resetPassword", async (req, res, next)=>{
    let message = await as.resetPassword(req.body)

    response({
        res,
        message
    })

})

authRouter.post("/login",vaildator(av.loginSchema),async (req, res, next)=>{
    // try{
    //     av.loginSchema.parse(req.body)
    // }catch(e){
    //     res.status(400).json({
    //         message:"validation error",
    //         issues: e.issues
    //     })

    // }


        let issuer = `${req.protocol}://${req.host}`
        let tokens = await as.login(req.vaildate.body , issuer)
        return response({
            res,
            data:tokens,
            message:"user loged in"
        })
    


})

authRouter.get("/rotate-token",async (req, res)=>{
    let issuer = `${req.protocol}://${req.host}`
    let tokens = await as.rotateToken(req.headers.authorization , issuer)

    return response({
        data: tokens ||{},
        status : 200,
        message :  "Token Rotated " ,
        res
    })

})

authRouter.post("/logout",auth,async (req, res, next)=>{

        let issuer = `${req.protocol}://${req.host}`
        let data = await as.logout(req.headers.authorization, req.body.type)
        return response({
            res,
            data,
            message:"user logout"
        })
    


})

export default authRouter