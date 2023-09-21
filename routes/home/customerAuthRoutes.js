// authentication routes (create register, login, account create )
const router = require("express").Router();
const customerAuthControllers = require("../../controllers/home/customerAuthControllers");

router.post("/customer/customer-register", customerAuthControllers.customer_register);

module.exports = router;
