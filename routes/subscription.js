const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const SubscriptionController = require('../controller/subscription_plan');


router.post("/add_subscription", SubscriptionController.add_subscription);
// router.post("/show_subscription", SubscriptionController.show_subscription);

module.exports = router;