import mongoose from "mongoose";
import { SchemaNameEnum } from "../constants.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model(SchemaNameEnum.CATEGORY, categorySchema);
