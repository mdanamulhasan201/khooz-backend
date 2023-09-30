// authentication routes (create register, login, account create )
const router = require("express").Router();
const cartControllers = require("../../controllers/home/cartControllers");

router.post("/home/product/add-to-cart",cartControllers.add_to_cart);
router.get("/home/product/get-cart-products/:userId", cartControllers.get_cart_products);
router.delete("/home/product/delete-cart-product/:cartId", cartControllers.delete_cart_product);
router.put("/home/product/quantity-increment/:cartId", cartControllers.quantity_increment);
router.put("/home/product/quantity-decrement/:cartId", cartControllers.quantity_decrement);

module.exports = router;
