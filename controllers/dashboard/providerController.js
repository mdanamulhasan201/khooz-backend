const sellerModal = require("../../models/sellerModal");
const { responseReturn } = require("../../utiles/response");

class providerController {
  // provider / seller get
  get_provider_request = async (req, res) => {
    // console.log(req.query);
    const { searchValue } = req.query;
    try {
      if (searchValue) {
        //const seller
      } else {
        const sellers = await sellerModal.find({ status: "active" });

        const totalSeller = await sellerModal
          .find({ status: "active" })
          .countDocuments();
        responseReturn(res, 200, { totalSeller, sellers });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };


  get_provider_details = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const seller = await sellerModal.findById(sellerId);
      responseReturn(res, 200, { seller });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}
module.exports = new providerController();
