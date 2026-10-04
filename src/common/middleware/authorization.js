import { models } from "../../db/index.js"
import { findOne } from "../../db/repositery/base.repo.js"
import { BadRequestException, ForbiddenException, NotFoundException, unAuthorizedException } from "../exceptions/index.js"
import { enums, myCompare } from "../index.js"
import { verfiyToken } from "../utiltes/index.js"

export default (role) => {
    return (req,res,next)=>{
        if(req.user.role < role) ForbiddenException("Not allowed !")
        next()
    }
}