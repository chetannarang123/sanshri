const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const StoreController = require('../controller/store_details');


router.post("/store_details", StoreController.store_details);
router.post("/all_stores", checkAuth,StoreController.show_all_stores);
router.post("/filter_stores", checkAuth,StoreController.show_filtered_stores);

module.exports = router;