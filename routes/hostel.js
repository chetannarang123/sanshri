const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const HostelController = require('../controller/hostel_details');


router.post("/hostel_details", HostelController.hostel_details);
router.post("/all_hostel", checkAuth,HostelController.show_all_hostels);
router.post("/filter_hostel", checkAuth,HostelController.show_filtered_hostel);

module.exports = router;