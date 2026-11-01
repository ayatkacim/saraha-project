// import mongoose, { Types } from "mongoose";
// import { enums } from "../../common/index.js";



// let messageSchema = new  mongoose.Schema({
//     content: {
//         type: String,
//         minLength: 5,
//         maxLength: 5000,
//         required: function(value) {
//             return !value.images.length
//         }
//     },
//     images: {
//         type: [String],
//     },
//     receiverId: {
//         type: Types.ObjectId,
//         ref : "user",
//         required:true
//     },
//     senderId: {
//         type: Types.ObjectId,
//         ref : "user"
//     }

// },{

//     timestamps:true ,
//     strict :true ,
//     strictQuery: true,
//     toJSON : {virtuals : true},
//     toObject : {virtuals : true}
// })



// //if u have user return it, if not create it
// export const messageModel = mongoose.model("message", messageSchema);