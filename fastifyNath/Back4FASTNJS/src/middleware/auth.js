import jwt from "jsonwebtoken";
import { response } from "../helpers/Response.js";
import { userModel } from "../models/user.model.js";

const messageNoAuth=(reply)=>{
    return response(reply,401,false,"","no estás autorizado")
}

export const verifyToken=async(req,reply,done)=>{
    let token=null
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        // console.log("ingrese")
        token=req.headers.authorization.split(" ")[1]

        jwt.verify(token, "abc123", async (err,payload)=>{
            if(err){
                return messageNoAuth(reply)
            }
            // console.log(payload)
            const user=await userModel.findById({_id:payload.user})
            if(!user){
                return messageNoAuth(reply)
            }
            
            req.userId=payload.user

            done()
        })
    }
    if(!token){
        return messageNoAuth(reply)
    }
}