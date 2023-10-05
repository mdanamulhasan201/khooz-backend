// authentication routes (create register, login, account create )
const router = require('express').Router()

const homeControllers = require('../../controllers/home/homeControllers')
router.get('/get-categorys', homeControllers.get_categorys)
router.get('/get-products', homeControllers.get_products)
router.get('/get-product-details/:slug', homeControllers.get_product_details)
router.get('/price-range-latest-product', homeControllers.price_range_product )
router.get('/query-products', homeControllers.query_products )

router.post('/customer/add-review', homeControllers.customer_review )
router.get('/customer/get-reviews/:productId', homeControllers.get_reviews)

router.post('/provider/submit-review', homeControllers.provider_review )
router.get('/provider/get-provider-reviews/:sellerId', homeControllers.get_provider_reviews)
module.exports = router;
