import mongoose from "mongoose";

/**
 * Validate the ObjectIds
 *
 * @param {string | string[]} value
 */
const isValidObjectId = (value) => {
  let isValid = false;
  if (typeof value === "string") {
    isValid = mongoose.isValidObjectId(value);
  } else if (Array.isArray(value)) {
    isValid = value.every((element) => mongoose.isValidObjectId(element));
  } else {
    isValid = false;
  }

  return isValid;
};

export { isValidObjectId };
