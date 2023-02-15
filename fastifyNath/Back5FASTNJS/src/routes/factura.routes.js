import facturaCtrl from "../controllers/Factura.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { facturaValidSchema } from '../validSchema/factura.js'

const middleware=(req,reply,done)=>{
    verifyToken(req,reply,done)
}

export const facturaRoutes=(fastify,opts,done)=>{

    fastify.get("/", facturaCtrl.listAll);
    fastify.get("/:id", facturaCtrl.listById);
    fastify.post("/", {preHandler:[middleware]},facturaCtrl.create);
    fastify.delete("/:id",{preHandler:[middleware]}, facturaCtrl.delete);
    fastify.put("/:id", {preHandler:[middleware]},facturaCtrl.update);


    done()
}

export default route;
