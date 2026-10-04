import { response } from "express"

export default (err, req, res, next) => {
    console.log(err)
    res.status(err.statusCode ||err.cause || 500).json({
        message: err.message,
        stack: err.stack
    })
}