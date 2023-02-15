import userCtrl from '../controllers/user.controller.js'
import { userValidSchema } from '../validSchema/user.js'

export const userRoutes=(fastify,opts,done)=>{
    fastify.post('/register',{
        schema:userValidSchema},userCtrl.register)
    fastify.post('/login',{
        schema:userValidSchema},userCtrl.login)

    done()
}


