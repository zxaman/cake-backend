import { matchedData, validationResult } from "express-validator";
// eslint-disable-next-line no-unused-vars
import { errorHandler } from "../middlewares/error.middleware.js";
import { ApiError } from "../utils/ApiError.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 * @description This is the validate middleware responsible to centralize the error checking done by the `express-validator` `ValidationChains`.
 * This checks if the request validation has errors.
 * If yes then it structures them and throws an {@link ApiError} which forwards the error to the {@link errorHandler} middleware which throws a uniform response at a single place
 *
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    // Sanitize the request data and remove any extra fields available in reqest data.
    // req.query = matchedData(req, { locations: ["query"] });
    // req.params = matchedData(req, { locations: ["params"] });
    req.body = matchedData(req, { locations: ["body"] });
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  // 422: Unprocessable Entity
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
