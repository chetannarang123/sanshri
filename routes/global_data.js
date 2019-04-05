const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const Global_Data_Controller = require('../controller/global_data');


router.post("/random_data",checkAuth, Global_Data_Controller.random_data);
//router.post("/all_hostel", HostelController.show_all_hostels);

module.exports = router;