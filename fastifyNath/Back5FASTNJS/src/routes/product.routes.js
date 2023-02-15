import productCtrl from "../controllers/Product.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/imgUpload.js";
import { productValidSchema } from '../validSchema/product.js'


const middleware=(req,reply,done)=>{
    verifyToken(req,reply,done)
}

export const postRoutes=(fastify,opts,done)=>{

    fastify.get("/", productCtrl.listAll);
    fastify.get("/:id", productCtrl.listById);

    fastify.post("/", {
        schema:productValidSchema, 
        preValidation: [middleware, upload.single("img")]}, 
        productCtrl.create);

    fastify.delete("/:id", {preHandler:[middleware]}, productCtrl.delete);
    
    fastify.put("/:id", {
        schema:productValidSchema, 
        preValidation: [middleware, upload.single("img")]}, 
        productCtrl.update);

    done()
}
