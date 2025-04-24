const express = require("express");
const { getCakes } = require("../../controllers/cake/get-cakes.controller");
const { getCakeById } = require("../../controllers/cake/get-cake-by-id.controller");
const { createCake } = require("../../controllers/cake/create-cake.controller");
const { updateCake } = require("../../controllers/cake/update-cake.controller");
const { deleteCake } = require("../../controllers/cake/delete-cake.controller");
const { getCategories } = require("../../controllers/cake/get-categories.controller");

const router = express.Router();

// Public routes - no authentication needed
router.get('/', getCakes);
router.get('/categories', getCategories);
router.get('/:id', getCakeById);

// Direct database management routes
router.post('/', createCake);
router.put('/:id', updateCake);
router.delete('/:id', deleteCake);

module.exports = router;