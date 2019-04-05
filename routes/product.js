const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const ProductsController = require('../controller/product');


router.post("/product_details", ProductsController.product_details);
router.post("/all_product",checkAuth, ProductsController.show_all_products);
router.post("/quantity", ProductsController.product_quantity);

module.exports = router;