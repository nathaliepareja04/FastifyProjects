import bcrypt from "bcrypt"

export const encryptPassword=(password)=>{

    try {
        const salt=bcrypt.genSaltSync(10)

        const passwordEncriptada=bcrypt.hashSync(password,salt)

        return passwordEncriptada
    } catch (error) {
        response("error en encyptPassword",error.message)        

    }

}