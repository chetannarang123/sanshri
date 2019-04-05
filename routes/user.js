const express = require("express");
const router = express.Router();
const checkAuth=require('../middleware/check-auth');
const UserController = require('../controller/user');

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/forgot_password", UserController.forgot_password);
router.post("/verify_otp", UserController.verify_otp);
router.post("/update_password",checkAuth, UserController.update_password);
router.post("/edit_profile",checkAuth, UserController.edit_profile);
router.post("/get_profile",checkAuth, UserController.get_profile);
router.post("/resetpassword", UserController.resetPassword);
router.post("/social_login", UserController.social_login);
router.post("/user_deactivate",checkAuth, UserController.user_deactivate);
router.post("/user_subscription",checkAuth, UserController.user_subscription);
router.post("/register_complaint",checkAuth, UserController.register_complaint);
router.post("/show_all_subscriptions",checkAuth, UserController.show_all_subscriptions);
router.post("/payment",checkAuth, UserController.payment);
router.get("/payment_done",UserController.payment_done);
router.post("/order_history",checkAuth,UserController.order_history);
module.exports = router;