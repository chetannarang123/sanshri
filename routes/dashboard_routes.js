const express = require("express");
const router = express.Router();
const Dashboard_function = require('../controller/dashboard_function');

router.get("/", Dashboard_function.dashboard);
router.get("/user", Dashboard_function.getallusers);
router.get("/view_user", Dashboard_function.view_user);
router.get("/view_add_user", Dashboard_function.view_add_user);
router.post("/add_user", Dashboard_function.add_user);
router.get("/change_status", Dashboard_function.change_status);
router.get("/user_sort", Dashboard_function.user_sort);
router.get("/date_sort", Dashboard_function.date_sort);
router.post("/update_user", Dashboard_function.update_user);
router.post("/multiple_delete_users", Dashboard_function.multiple_delete_users);

router.get("/stores", Dashboard_function.getallstores);
router.get("/view_store", Dashboard_function.view_store);
router.get("/view_add_store", Dashboard_function.view_add_store);
router.post("/add_store", Dashboard_function.add_store);
router.get("/change_store_status", Dashboard_function.change_store_status);
router.get("/store_sort", Dashboard_function.store_sort);
router.get("/store_date_sort", Dashboard_function.store_date_sort);
router.post("/update_store", Dashboard_function.update_store);
router.post("/multiple_delete_stores", Dashboard_function.multiple_delete_stores);


router.get("/products", Dashboard_function.getallproducts);
router.get("/view_product", Dashboard_function.view_product);
router.get("/view_add_product", Dashboard_function.view_add_product);
router.post("/add_product", Dashboard_function.add_product);
router.get("/change_product_status", Dashboard_function.change_product_status);
// router.get("/product_sort", Dashboard_function.product_sort);
// router.get("/product_date_sort", Dashboard_function.product_date_sort);
router.post("/update_product", Dashboard_function.update_product);
router.post("/multiple_delete_products", Dashboard_function.multiple_delete_products);


router.get("/categories", Dashboard_function.getallcategories);
router.get("/view_add_categories", Dashboard_function.view_add_categories);
router.post("/add_categories", Dashboard_function.add_categories);
router.post("/multiple_delete_categories", Dashboard_function.multiple_delete_categories);
router.post("/update_categories", Dashboard_function.update_categories);
router.get("/view_categories", Dashboard_function.view_categories);


router.get("/hostel", Dashboard_function.getallhostel);
router.get("/view_add_hostel", Dashboard_function.view_add_hostel);
router.post("/add_hostel", Dashboard_function.add_hostel);
router.post("/multiple_delete_hostel", Dashboard_function.multiple_delete_hostel);
router.post("/update_hostel", Dashboard_function.update_hostel);
router.get("/view_hostel", Dashboard_function.view_hostel);
router.get("/change_hostel_status", Dashboard_function.change_hostel_status);
//router.get("/detail_edit", dashboard_function.show_user_detail_edit);


router.get("/hostel_subscriptions", Dashboard_function.getallhostel_subscriptions);
router.get("/view_add_hostel_subscriptions", Dashboard_function.view_add_hostel_subscriptions);
router.post("/add_hostel_subscriptions", Dashboard_function.add_hostel_subscriptions);
router.post("/multiple_delete_hostel_subscriptions", Dashboard_function.multiple_delete_hostel_subscriptions);
router.post("/update_hostel_subscriptions", Dashboard_function.update_hostel_subscriptions);
router.get("/view_hostel_subscriptions", Dashboard_function.view_hostel_subscriptions);
router.get("/change_hostel_status_subscriptions", Dashboard_function.change_hostel_status_subscriptions);

router.get("/mess", Dashboard_function.getallmess);
router.get("/view_add_mess", Dashboard_function.view_add_mess);
router.post("/add_mess", Dashboard_function.add_mess);
router.post("/multiple_delete_mess", Dashboard_function.multiple_delete_mess);
router.post("/update_mess", Dashboard_function.update_mess);
router.get("/view_mess", Dashboard_function.view_mess);
router.get("/change_mess_status", Dashboard_function.change_mess_status);



router.get("/mess_subscriptions", Dashboard_function.getallmess_subscriptions);
router.get("/view_add_mess_subscriptions", Dashboard_function.view_add_mess_subscriptions);
router.post("/add_mess_subscriptions", Dashboard_function.add_mess_subscriptions);
router.post("/multiple_delete_mess_subscriptions", Dashboard_function.multiple_delete_mess_subscriptions);
router.post("/update_mess_subscriptions", Dashboard_function.update_mess_subscriptions);
router.get("/view_mess_subscriptions", Dashboard_function.view_mess_subscriptions);
router.get("/change_mess_status_subscriptions", Dashboard_function.change_mess_status_subscriptions);


router.get("/orders", Dashboard_function.getallorders);
router.get("/order_details", Dashboard_function.order_details);

module.exports = router;

