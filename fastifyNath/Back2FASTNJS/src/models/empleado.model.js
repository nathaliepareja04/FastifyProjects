import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2"

const {Schema,model}=mongoose

const empleadoSchema=new Schema({
    nombres:{
        type:String,
        required:[true,"El campo nombres es requerido"]
    },
    apellidos:{
        type:String,
        default:""
    },
    correo:{
        type:String,
        unique:true,
        required:[true,"el campo correo es requerido"]
    },
    edad:{
        type:Number,
        required:[true,"el campo edad es requerido"]
    },
    salario:{
        type:Number,
        required:[true,"el campo salario es requerido"]
    },
    cargo:{
        type:String,
        required:[true,"el campo salario es requerido"]
    },
},
{
    timestamps:true
}
)

empleadoSchema.plugin(mongoosePaginate)

export const empleadoModel=model("empleado",empleadoSchema)