const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const MessController = require('../controller/mess_details');


router.post("/mess_details", MessController.mess_details);
router.post("/all_mess", checkAuth,MessController.show_all_mess);
router.post("/filter_mess", checkAuth,MessController.show_filtered_mess);

module.exports = router;