import postCtrl from '../controllers/post.controller.js'
import { upload } from '../middleware/imgUpload.js'
import { verifyToken } from '../middleware/auth.js'
import { postValidSchema } from '../validSchema/post.js'

const middleware=(req,reply,done)=>{
    verifyToken(req,reply,done)
}

export const postRoutes=(fastify,opts,done)=>{

    fastify.get('/',{preHandler:[middleware]},postCtrl.listar)
    fastify.get('/user',{preHandler:[middleware]},postCtrl.listarPostLogin)
    fastify.get('/:id',{preHandler:[middleware]},postCtrl.listOne)

    fastify.post('/',{
        schema:postValidSchema, preValidation: [middleware, upload.single("img")]},postCtrl.add)

    fastify.delete('/:id',{preHandler:[middleware]},postCtrl.delete)

    fastify.put('/:id',{preValidation:[middleware, upload.single("img")]} ,postCtrl.update)

    done()
}