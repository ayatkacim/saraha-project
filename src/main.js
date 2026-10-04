import express from "express";
import {connection} from "./db/index.js";
import * as common from "./common/index.js"
import config from "./config/config.service.js";
import * as routers from "./module/index.js"




const app = express()
const port = config.port

app.use(express.json())


app.use("/auth", routers.authRouter)
app.use("/user", routers.userRouter)

app.get("/",(req, res, next)=>{
    res.status(200).json({
        message: "welcome to my app"
    })

})

app.use("/{*dummy}", (req, res, next)=>{
    res.status(404).json({
        message: "Route not found",
        route: req.params.dummy.join("/")
    })

})

app.use(common.middleware.globalErrorHandler)
await connection()
app.listen(port,()=>{
    console.log("server is running on port",port)
})