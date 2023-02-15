import mongoose from "mongoose";
import { productModel } from "./Product.js";
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: [true, "el campo name es obligatorio"] },

    description: {
      type: String,
      required: [true, "el description name es obligatorio"],
    },

    imgUrl: {
      type: String,
      default: null,
    },

    public_id: String,
  },
  { timestamps: true }
);

categorySchema.methods.setImg = function setImg({ secure_url, public_id }) {
  this.imgUrl = secure_url;
  this.public_id = public_id;
};

categorySchema.pre("deleteOne", { document: true }, async function () {
  await productModel.deleteMany({ category: this._id.toString() });
});

export const categoryModel = model("category", categorySchema);
