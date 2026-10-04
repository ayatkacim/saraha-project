
import { exceptions , verfiyToken , createTokens , myHash ,myCompare, enums, encrypting} from "../../common/index.js"
import {models , Queries} from "../../db/index.js"


let {userModel} =models



export const createUser = async (data)=>{
    let exists = await Queries.findOne({ model: userModel, where: { email: data.email } , check:true })
    //let exists = await userModel.findOne({email: data.email})
    if(exists) throw exceptions.ConflictException("this user already exist")
        //throw new Error("this user already exists", {cause : 409})

    let user = await Queries.create({model:userModel , data:{...data, phone: data.phone ? encrypting(data.phone) : null ,DOB : new Date(data.DOB), password: await myHash(data.password)}})
    //let user = userModel.create({...data, DOB : new Date(data.DOB)})
    return user
}


export const login = async (where , issuer)=>{
    let {email , password} = where
    let user = await Queries.findOne({model: userModel , where:{email}})
    //let user = await userModel.findOne(data)
    console.log(user)
    if(!user || !await myCompare({plainText: password , hashedText: user.password})) throw exceptions.NotFoundException("user not Found")
        //throw new Error("user not found", {cause:404})
    let jti= Math.ceil(Math.random()*1000)
    
    let tokens = createTokens({
        userId: user._id,
        role : user.role,
        issuer:issuer
    })
    
        return tokens
    
}



export const rotateToken = async (refreshToken , issuer)=>{
    // let decode = jwt.decode(refreshToken)
    // console.log(decode)


    let user = await verfiyToken(refreshToken, enums.tokenTypesEnum.refresh)
    let tokens = createTokens({userId: user._id , issuer , role:user.role})

    return tokens
    
}