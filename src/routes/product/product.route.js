import { Router } from "express";
import createProduct from "../../controllers/product/create-product.controller.js";
import { validate } from "../../validators/validator.js";
import createProductValidator from "../../validators/product/create-product.validator.js";
import { uploads } from "../../middlewares/multer.middleware.js";
import getAllProducts from "../../controllers/product/getAll.product.controller.js";
import getProductById from "../../controllers/product/get-product-by-id.controller.js";

const router = Router();

const productImageFilter = (req, file, cb) => {
    console.log("file", file);
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

router.post(
    "/create",
    uploads(productImageFilter).single("image"),
    (req, res, next) => {
        if (req.file) {
            req.body.image = req.file.path;
        }
        next();
    },
    createProductValidator(),
    validate,
    createProduct
);

router.get("/all", getAllProducts);

router.get("/:id", getProductById);



export default router;
