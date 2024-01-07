// authentication routes (create register, login, account create )
const router = require("express").Router();
const { authMiddleware } = require("../../middlewars/authMiddleware");
const {get_seller_index_data, get_admin_index_data} = require('../../controllers/dashboard/dashboardIndexController')

router.get("/seller/get-dashboard-index-data", authMiddleware, get_seller_index_data);
router.get("/admin/get-dashboard-index-data", authMiddleware, get_admin_index_data);


module.exports = router;
