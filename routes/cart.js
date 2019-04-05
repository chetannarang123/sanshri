const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const CartController = require('../controller/cart');


router.post("/add_to_cart",checkAuth, CartController.add_to_cart);
router.post("/my_cart",checkAuth, CartController.my_cart);
router.post("/remove",checkAuth, CartController.remove_product);
//router.post("/all_hostel", HostelController.show_all_hostels);

module.exports = router;