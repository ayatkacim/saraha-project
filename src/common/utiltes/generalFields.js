import { z } from "zod";
import {enums} from "../index.js"
import {getErrorMessage} from "./vaildationErrors.js"

export default{
    phone:(lang)=> z.e164({pattern:/01[0-25]\d{8}$/, error:getErrorMessage("wrongPhone",lang)}),
    email:(lang)=> z.email({
        error:getErrorMessage("invalidEmail",lang)
    }),
    password: (lang)=> z.string().max(20, {error:lang == "ar" ? "كلمه السر طويله للغايه": "password is too long"}).min(5, 
        {error:lang == "ar" ? "كلمه السر قصيره للغايه": "password is too short"}),
    confirmPassword: (lang)=> z.string().max(20).min(5),
    fullName: (lang)=> z.string().regex(/^[A-Za-z]{3,20}\s[A-Za-z]{3,20}$/ , {error :getErrorMessage("fullName", lang)}),
    gender: (lang)=> z.union([z.literal(enums.genderEnum.male), z.literal(enums.genderEnum.female)],{error:"gender must be male or female"}),
    DOB: (lang)=> z.string(),
    page : (lang)=> z.coerce.number().gte(1),
    limit : (lang)=> z.coerce.number().gte(1),
    userId : (lang)=> z.string().length(24).min(1),
    headers:(lang)=> z.object({
        authorization :(lang)=> z.string().jwt({alg:"HS256"}),
        "accecpt-lan" : (lang)=> z.enum(["ar", "en"])
    }),
    stringBool :(lang)=> z.stringbool({
            truthy:["true"],
            falsy:["false"],
            case:"sensitive",
            error:"this value must be true or false"
        })
}