const express = require("express");
const router = express.Router();
const admin_login_function = require('../controller/admin_login_function');



router.post("/", admin_login_function.adminLogin);

module.exports = router;