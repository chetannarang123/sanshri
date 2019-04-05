const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const SearchController = require('../controller/global_search');


router.post("/all_search",checkAuth, SearchController.global_search);
router.post("/hostel_search",checkAuth, SearchController.hostel_search);
router.post("/mess_search", checkAuth,SearchController.mess_search);
router.post("/store_search",checkAuth, SearchController.store_search);
router.post("/hostel_detail", checkAuth,SearchController.hostel_detail);
router.post("/mess_detail", checkAuth,SearchController.mess_detail);
router.post("/store_detail",checkAuth, SearchController.store_detail);
router.post("/product_detail",checkAuth, SearchController.product_detail);
router.post("/categories",checkAuth, SearchController.categories);
router.post("/product_search",checkAuth, SearchController.product_search);
module.exports = router;