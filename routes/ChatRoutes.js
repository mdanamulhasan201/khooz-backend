

// authentication routes (create register, login, account create )
const router = require("express").Router();
const chatControllers = require("../controllers/Chat/chatControllers");

router.post("/chat/customer/add-customer-friend",chatControllers.add_customer_friend);

module.exports = router;
