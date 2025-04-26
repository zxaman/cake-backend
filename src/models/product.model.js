import mongoose, { Schema } from "mongoose";
import { SchemaNameEnum } from "../constants.js";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model(SchemaNameEnum.PRODUCT, productSchema);
