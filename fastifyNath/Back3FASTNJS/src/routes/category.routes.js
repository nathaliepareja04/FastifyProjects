import categoryCtrl from '../controllers/category.controller.js'
import { categoryValidSchema } from '../validSchema/category.js'


export const categoryRoutes=(fastify,opts,done)=>{

    fastify.get('/',categoryCtrl.listar)
    fastify.get('/:id',categoryCtrl.listarPorId)
    
    fastify.post('/',{schema:categoryValidSchema},categoryCtrl.crear)
    
    fastify.delete('/:id',categoryCtrl.eliminar)
    
    fastify.put('/:id',{schema:categoryValidSchema},categoryCtrl.actualizar)
    
    done()
}

