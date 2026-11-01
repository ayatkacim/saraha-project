// import { userRepo as ur, messageRepo as mr } from "../../db/index.js"

// export const sendMessage = async (data) => {
//     let { receiverId } = data

//     let user = await ur.findUser({
//         where: { _id: receiverId },
//         select: "_id",
//         check: true
//     })

//     return await mr.createMessage({ data })
// }