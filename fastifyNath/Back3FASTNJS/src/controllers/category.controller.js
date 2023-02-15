import { response } from "../helpers/Response.js";
import { categoryModel } from "../models/category.model.js";
import { postModel } from "../models/post.model.js";

const categoryCtrl={}

categoryCtrl.listar=async(req,reply)=>{
    try {
        const categorias=await categoryModel.find()
        response(reply,200,true,categorias,"lista de categorias")
        
    } catch (error) {
        response(reply,500,false,"",error.message)
    }
}

categoryCtrl.crear=async(req,reply)=>{
    try {
        const nuevaCategoria=await categoryModel.create(req.body)
        response(reply,201,true,nuevaCategoria,"categoria creada")
    } catch (error) {
        response(reply,500,false,"",error.message)
    }
}


categoryCtrl.listarPorId=async(req,reply)=>{
    try {
        const {id}=req.params
        const categoria=await categoryModel.findById(id)
        if(!categoria){
            return response(reply,404,false,"","categoria no encontrada")
        }
        response(reply,200,true,categoria,"categoria encontrada")
    } catch (error) {
        response(reply,500,false,"",error.message)
    }
}


categoryCtrl.eliminar=async(req,reply)=>{
    try {
        const {id}=req.params
        const categoria=await categoryModel.findById(id)
        if(!categoria){
            return response(reply,404,false,"","categoria no encontrada")
        }

        await categoria.deleteOne()
        response(reply,200,true,"","categoria eliminada")
    } catch (error) {
        response(reply,500,false,"",error.message)
    }
}


categoryCtrl.actualizar=async(req,reply)=>{
    try {
        const {id}=req.params
        const categoria=await categoryModel.findById(id)
        if(!categoria){
            return response(reply,404,false,"","categoria no encontrada")
        }
        await categoria.updateOne(req.body)
        response(reply,200,true,"","categoria actualizada")
    } catch (error) {
        response(reply,500,false,"",error.message)
    }
}

export default categoryCtrl