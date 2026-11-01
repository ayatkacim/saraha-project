import mongoose from "mongoose";
import { enums } from "../../common/index.js";


let userSchema = new  mongoose.Schema({
    firstName:{
        type:String,
        required : true,
        minLength: 3,
        maxLength :30,
        trim: true
    },
    lastName:{
        type:String,
        required : true,
        minLength: 3,
        maxLength :30,
        trim: true
    },
    email:{
        type:String,
        required : true,
        unique:true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        required : true,
        minLength: 6
    },
    DOB :Date,
    gender:{
        type: String,
        enum:Object.values(enums.genderEnum),
        default:enums.genderEnum.male
    },
    image:String,
    deletedAt:Date,
    confirmEmail:Boolean,
    phone: String,
    role:{
        type: Number,
        enum:Object.values(enums.roleEnum),
        default:enums.roleEnum.user
    },
    provider:{
        type: Number,
        enum:Object.values(enums.providerEnum),
        default:enums.providerEnum.system
    },
    changedAt: Number

},{

    timestamps:true ,
    strict :true ,
    strictQuery: true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})

userSchema.virtual("fullName").set(function(value){
    let [firstName, lastName]= value.split(" ")
    this.firstName=firstName
    this.lastName=lastName
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})

//if u have user return it, if not create it
export default mongoose.models.user || mongoose.model("user", userSchema);