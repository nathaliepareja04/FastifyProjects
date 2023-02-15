import {
  eliminarImagenCloudinary,
  subirImageACloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/Response.js";
import { categoryModel } from "../models/Category.js";
import { productModel } from "../models/Product.js";
import mongooseErrorHandler from "mongoose-validation-error-message-handler";

const categoryCtrl = {};

categoryCtrl.create = async (req, reply) => {
  try {
    const { name, description } = req.body;

    const newCategory = new categoryModel({
      name,
      description,
    });

    if (req.file) {
      const { secure_url, public_id } = await subirImageACloudinary(req.file);
      newCategory.setImg({ secure_url, public_id });
    }

    await categoryModel.create(newCategory);
    response(reply, 201, true, newCategory, "registro creado");
  } catch (error) {
    const errorValidation = mongooseErrorHandler(error);
    errorValidation.name === "MongooseValidatorError"
      ? response(reply, 400, false, "", error.message)
      : response(reply, 500, false, "", error.message);
  }
};

categoryCtrl.listAll = async (req, reply) => {
  try {
    const data = await categoryModel.find();
    response(reply, 200, true, data, "lista de categorias");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

categoryCtrl.listById = async (req, reply) => {
  try {
    const { id } = req.params;
    const data = await categoryModel.findById(id);
    if (!data) {
      return response(reply, 404, false, "", "registro no encontrado");
    }
    response(reply, 200, true, data, "registro encontrado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

categoryCtrl.delete = async (req, reply) => {
  try {
    const { id } = req.params;
    const data = await categoryModel.findById(id);
    if (!data) {
      return response(reply, 404, false, "", "registro no encontrado");
    }

    const productEncontrado = await productModel.findOne({
      category: data._id,
    });
    if (productEncontrado) {
      return response(
        reply,
        400,
        false,
        "",
        "esta categoria no se puede eliminar porque tiene productos vinculados"
      );
    }

    if (data.public_id) {
      await eliminarImagenCloudinary(data.public_id);
    }

    await data.deleteOne();
    response(reply, 200, true, "", "registro eliminado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

categoryCtrl.update = async (req, reply) => {
  try {
    const { id } = req.params;
    const data = await categoryModel.findById(id);
    if (!data) {
      return response(reply, 404, false, "", "registro no encontrado");
    }

    if (req.file) {
      if (data.public_id) {
        await eliminarImagenCloudinary(data.public_id);
      }
      const { secure_url, public_id } = await subirImageACloudinary(req.file);
      data.setImg({ secure_url, public_id });
      await data.save();
    }

    await data.updateOne(req.body);
    response(reply, 200, true, "", "registro actualizado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

export default categoryCtrl;
