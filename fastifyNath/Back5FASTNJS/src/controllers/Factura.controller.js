import { response } from "../helpers/Response.js";
import { facturaModel } from "../models/Factura.js";
import { productModel } from "../models/Product.js";
import mongooseErrorHandler from "mongoose-validation-error-message-handler";

const facturaCtrl = {};

facturaCtrl.create = async (req, reply) => {
  try {
    const { product, quantity } = req.body;
    const productEncontrado = await productModel.findById({ _id: product });
    if (!productEncontrado) {
      return response(
        reply,
        404,
        false,
        "",
        "el producto no existe en la base de datos"
      );
    }

    if (quantity > productEncontrado.stock) {
      return response(
        reply,
        400,
        false,
        "",
        `La quantity que desea comprar no esta disponible, el producto solo tiene un stock de ${productEncontrado.stock} `
      );
    }

    await productEncontrado.updateOne({
      stock: productEncontrado.stock - quantity,
    });

    const factura = new facturaModel({
      ...req.body,
      user: req.userId,
      total: productEncontrado.price * quantity,
    });

    await factura.save();
    response(reply, 201, true, factura, "registro creado");
  } catch (error) {
    const errorValidation = mongooseErrorHandler(error);
    errorValidation.name === "MongooseValidatorError"
      ? response(reply, 400, false, "", error.message)
      : response(reply, 500, false, "", error.message);
  }
};

facturaCtrl.listAll = async (req, reply) => {
  try {
    const data = await facturaModel
      .find()
      .populate("product")
      .populate("user", "-password");
    response(reply, 200, true, data, "lista de registros");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

facturaCtrl.listById = async (req, reply) => {
  try {
    const { id } = req.params;
    const data = await facturaModel
      .findById(id)
      .populate("product")
      .populate("user", "-password");
    if (!data) {
      return response(reply, 404, false, "", "registro no encontrado");
    }
    response(reply, 200, true, data, "registro encontrado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

facturaCtrl.delete = async (req, reply) => {
  try {
    const { id } = req.params;
    const factura = await facturaModel.findById(id);
    if (!factura) {
      return response(reply, 404, false, "", "registro no encontrado");
    }

    const productEncontrado = await productModel.findById({
      _id: factura.product,
    });

    if (!productEncontrado) {
      return response(
        reply,
        404,
        false,
        "",
        "el producto no existe en la base de datos"
      );
    }

    await productEncontrado.updateOne({
      stock: productEncontrado.stock + factura.quantity,
    });

    await factura.deleteOne();
    response(reply, 200, true, "", "factura eliminada");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

facturaCtrl.update = async (req, reply) => {
  try {
    const { id } = req.params;
    const { product, quantity } = req.body;

    const factura = await facturaModel.findById(id);
    if (!factura) {
      return response(reply, 404, false, "", "registro no encontrado");
    }

    const producto = await productModel.findById({
      _id: factura.product,
    });

    // si esta condicion se cumple es porque la factura se actualiza a otro producto
    if (product !== factura.product.toString()) {
      // actualizamos la factura con el producto nuevo, pero primero verifico si ese producto existe en la base de datos
      const productEncontrado = await productModel.findById({ _id: product });
      // esta validacion es extra
      if (!productEncontrado) {
        return response(
          reply,
          404,
          false,
          "",
          "el producto no existe en la base de datos"
        );
      }

      // le devolvemos el stock al producto anterior
      await producto.updateOne({
        stock: producto.stock + factura.quantity,
      });

      if (quantity > productEncontrado.stock) {
        return response(
          reply,
          400,
          false,
          "",
          `La quantity que desea comprar no esta disponible`
        );
      }
      // se actualiza el producto
      await productEncontrado.updateOne({
        stock: productEncontrado.stock - quantity,
      });

      // se actualiza la factura
      await factura.updateOne({
        ...req.body,
        user: req.userId,
        total: productEncontrado.price * quantity,
      });
    } else {
      // si ingresa a este else es porque el producto no se va a actualizar, pero si la cantidad
      if (quantity > producto.stock + factura.quantity) {
        return response(
          reply,
          400,
          false,
          "",
          `La quantity que desea comprar no esta disponible`
        );
      }

      // se actualiza el producto
      await producto.updateOne({
        stock: producto.stock + factura.quantity - quantity,
      });

      // se actualiza la factura
      await factura.updateOne({
        ...req.body,
        user: req.userId,
        total: producto.price * quantity,
      });
    }
    response(reply, 200, true, "", "factura actualizada");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

export default facturaCtrl;
