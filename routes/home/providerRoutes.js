const router = require("express").Router();
const providerController = require("../../controllers/dashboard/providerController");

router.get(
  "/get-provider-request",
  providerController.get_provider_request
);
router.get(
  "/get-provider-details/:sellerId",
  providerController.get_provider_details
);

module.exports = router;
