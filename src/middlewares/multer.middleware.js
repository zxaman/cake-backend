import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, path.join("public"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}_${Math.round(Math.random() * 1e10)}${path.extname(file.originalname)}`,
    );
  },
});

/**
 * @param {(req: import('express').Request, file: Express.Multer.File, cb: import("multer").FileFilterCallback) =>  import("multer").Multer } fileFilter
 */
export const uploads = (fileFilter) => {
  return multer({
    storage,
    fileFilter,
  });
};
