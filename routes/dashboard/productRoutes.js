// authentication routes (create register, login, account create )
const router = require("express").Router();

const { authMiddleware } = require("../../middlewars/authMiddleware");
const productController = require("../../controllers/dashboard/productController");

router.post("/product-add", authMiddleware, productController.add_product);
router.get("/product-get", authMiddleware, productController.products_get);

module.exports = router;
