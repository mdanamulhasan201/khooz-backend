// authentication routes (create register, login, account create )
const router = require("express").Router();
const customerAuthControllers = require("../../controllers/home/customerAuthControllers");

router.post(
  "/customer/customer-register",
  customerAuthControllers.customer_register
);
router.post("/customer/customer-login", customerAuthControllers.customer_login);
router.get("/customer/logout", customerAuthControllers.customer_logout);

module.exports = router;
