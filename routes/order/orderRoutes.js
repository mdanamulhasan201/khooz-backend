// authentication routes (create register, login, account create )
const router = require("express").Router();
const orderController = require("../../controllers/order/orderController");

// customer
router.post("/home/order/place-order",orderController.place_order);
router.get('/home/customer/get-dashboard-data/:userId', orderController.get_customer_dashboard_data)
router.get('/home/customer/get-orders/:customerId/:status', orderController.get_orders)
router.get('/home/customer/get-order-details/:orderId', orderController.get_order_details)
router.post('/order/create-payment', orderController.create_payment)
router.get('/order/confirm/:orderId', orderController.order_confirm)

// admin 
router.get('/admin/get-orders', orderController.get_admin_orders)
router.get('/admin/get-admin-order-details/:orderId', orderController.get_admin_order_details)
router.put('/admin/admin-order-status-updates/:orderId', orderController.admin_order_status_update)

// seller
router.get('/seller/orders/:sellerId', orderController.get_seller_orders)
router.get('/seller/get-seller-order-details/:orderId', orderController.get_seller_order_details)
router.put('/seller/seller-order-status-updates/:orderId', orderController.seller_order_status_update)

module.exports = router;
