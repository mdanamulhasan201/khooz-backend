// authentication routes (create register, login, account create )
const router = require("express").Router();

const paymentController = require("../../controllers/payment/paymentController");
const { authMiddleware } = require("../../middlewars/authMiddleware");

router.get('/payment/create-stripe-connect-account',authMiddleware,paymentController.create_stripe_connect_account)
router.put('/payment/active-stripe-connect-account/:activeCode',authMiddleware,paymentController.active_stripe_connect_account)


router.get('/payment/seller-payments-details/:sellerId',authMiddleware,paymentController.get_seller_payment_details)

router.get('/payment/get-request', authMiddleware, paymentController.get_payment_request)

router.post('/payment/confirm-payment-request', authMiddleware, paymentController.payment_request_confirm)

router.post('/payment/withdraw-Request',authMiddleware,paymentController.send_withdraw_Request)




module.exports = router;
