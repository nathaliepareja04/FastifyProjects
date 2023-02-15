import {
  eliminarImagenCloudinary,
  subirImageACloudinary,
} from "../helpers/cloudinary.actions.js";
import { response } from "../helpers/Response.js";
import { facturaModel } from "../models/Factura.js";
import { productModel } from "../models/Product.js";
import mongooseErrorHandler from "mongoose-validation-error-message-handler";

const productCtrl = {};

productCtrl.create = async (req, reply) => {
  try {
    const newProduct = new productModel({ ...req.body, user: req.userId });

    if (req.file) {
      const { secure_url, public_id } = await subirImageACloudinary(req.file);
      newProduct.setImg({ secure_url, public_id });
    }
    await productModel.create(newProduct);
    response(reply, 201, true, newProduct, "registro creado");
  } catch (error) {
    const errorValidation = mongooseErrorHandler(error);
    errorValidation.name === "MongooseValidatorError"
      ? response(reply, 400, false, "", error.message)
      : response(reply, 500, false, "", error.message);
  }
};

productCtrl.listAll = async (req, reply) => {
  try {
    const data = await productModel
      .find()
      .populate("category")
      .populate("user", "-password");
    response(reply, 200, true, data, "lista de productos");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

productCtrl.listById = async (req, reply) => {
  try {
    const { id } = req.params;
    const data = await productModel
      .findById(id)
      .populate("category")
      .populate("user", "-password");
    if (!data) {
      return response(replay, 404, false, "", "registro no encontrado");
    }
    response(reply, 200, true, data, "registro encontrado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

productCtrl.delete = async (req, reply) => {
  try {
    const { id } = req.params;
    const data = await productModel.findById(id);
    if (!data) {
      return response(reply, 404, false, "", "registro no encontrado");
    }

    const factura = await facturaModel.findOne({ product: data._id });
    console.log({ factura });
    if (factura) {
      return response(
        reply,
        400,
        false,
        "",
        "este producto no se puede eliminar porque tiene al menos una factura vinculada"
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

productCtrl.update = async (req, reply) => {
  try {
    const { id } = req.params;
    const data = await productModel.findById(id);
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

export default productCtrl;
