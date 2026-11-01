// import { Router } from "express";
// import { response } from "../../common/index.js";
// import * as ms from "./message.service.js";

// export const messageRouter = Router();

// messageRouter.post("/", async (req, res, next) => {
//     let data = await ms.sendMessage(req.body);

//     response({
//         res,
//         data,
//         status: 201,
//         message: "message sent"
//     });
// });