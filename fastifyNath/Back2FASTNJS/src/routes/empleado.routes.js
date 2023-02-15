import empleadoCtrl from '../controllers/empleado.controller.js'
import { seedDt } from '../seed/seedDb.js'
import { userValidSchema } from '../validSchema/user.js'


export const empleadoRoutes=(fastify,opts,done)=>{

    //seed poblar base de datos
    fastify.get("/seed",seedDt)
    fastify.get('/',empleadoCtrl.listar)
    fastify.get('/:id',empleadoCtrl.listById)

    fastify.post('/',{
        schema:userValidSchema},
        empleadoCtrl.guardar
    )
    
    fastify.put('/:id',empleadoCtrl.actualizar)
    
    fastify.delete('/:id',empleadoCtrl.eliminar)

    done()
}

