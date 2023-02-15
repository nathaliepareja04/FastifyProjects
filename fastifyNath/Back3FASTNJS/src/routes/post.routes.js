import postCtrl from '../controllers/post.controller.js'
import { upload } from '../middleware/imgUpload.js'
import { postValidSchema } from '../validSchema/post.js'

export const postRoutes=(fastify,opts,done)=>{

    fastify.get('/',postCtrl.listar)
    fastify.get('/:id',postCtrl.listOne)

    fastify.post('/',{
        schema:postValidSchema, preValidation: upload.single("img")},postCtrl.add
    )

    fastify.delete('/:id',postCtrl.delete)
    
    fastify.put('/:id',{
        schema:postValidSchema, preValidation: upload.single("img")}
        ,postCtrl.update)
    
    done()
}
