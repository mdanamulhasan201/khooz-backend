// authentication routes (create register, login, account create )
const router = require("express").Router();

const { authMiddleware } = require("../../middlewars/authMiddleware");
const sellerController = require("../../controllers/dashboard/sellerController");

router.get('/get-sellers-request',authMiddleware, sellerController.get_seller_request)
router.get('/get-active-seller',authMiddleware, sellerController.get_active_seller)
router.get('/get-deactive-seller',authMiddleware, sellerController.get_deactive_seller)
router.get('/get-seller-details/:sellerId',authMiddleware, sellerController.get_seller_details)
router.post('/seller-status-update',authMiddleware, sellerController.seller_status_update)



module.exports = router;
