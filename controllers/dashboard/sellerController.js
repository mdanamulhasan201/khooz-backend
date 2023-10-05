const sellerModal = require("../../models/sellerModal");
const { responseReturn } = require("../../utiles/response");

class sellerController {
  get_seller_request = async (req, res) => {
    const { searchValue } = req.query;
    try {
      if (searchValue) {
        //const seller
      } else {
        const sellers = await sellerModal.find({ status: "pending" });

        const totalSeller = await sellerModal
          .find({ status: "pending" })
          .countDocuments();
        responseReturn(res, 200, { totalSeller, sellers });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // provider / seller get
  get_seller_details = async (req, res) => {
    const { sellerId } = req.params;

    try {
      const seller = await sellerModal.findById(sellerId);
      responseReturn(res, 200, { seller });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  //   seller status update
  seller_status_update = async (req, res) => {
    const { sellerId, status } = req.body;
    // console.log(req.body);
    try {
      await sellerModal.findByIdAndUpdate(sellerId, {
        status,
      });
      const seller = await sellerModal.findById(sellerId);
      responseReturn(res, 200, {
        seller,
        message: "seller status update success",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  get_active_seller = async (req, res) => {
    let { searchValue } = req.query;
    console.log(searchValue);
    try {
      if (searchValue) {
        const sellers = await sellerModal.find({
          status: "active",
          $or: [
            { name: { $regex: new RegExp(searchValue, "i") } }, // Case-insensitive search for name
            { email: { $regex: new RegExp(searchValue, "i") } }, // Case-insensitive search for email
          ],
        });
        // .sort({ createdAt: -1 });
        const totalSeller = await sellerModal
          .find({
            status: "active",
            $or: [
              { name: { $regex: new RegExp(searchValue, "i") } }, // Case-insensitive search for name
              { email: { $regex: new RegExp(searchValue, "i") } }, // Case-insensitive search for email
            ],
          })
          .countDocuments();
        responseReturn(res, 200, { totalSeller, sellers });
      } else {
        const sellers = await sellerModal.find({ status: "active" });
        // .sort({ createdAt: -1 });

        const totalSeller = await sellerModal
          .find({ status: "active" })
          .countDocuments();
        console.log(sellers);
        responseReturn(res, 200, { totalSeller, sellers });
      }
    } catch (error) {
      console.log("active seller get", error.message);
      // Handle errors appropriately
    }
  };
}
module.exports = new sellerController();
