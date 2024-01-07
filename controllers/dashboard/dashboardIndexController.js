// function base
const {
  mongo: { ObjectId },
} = require("mongoose");
const adminOrderModal = require("../../models/orderModal/adminOrderModal");
const SellerWalletModal = require("../../models/SellerWalletModal");
const productModal = require("../../models/productModal");
const { responseReturn } = require("../../utiles/response");
const myShopWalletModal = require("../../models/myShopWalletModal");
const customerOrderModal = require("../../models/orderModal/customerOrderModal");
const sellerModal = require("../../models/sellerModal");

module.exports.get_seller_index_data = async (req, res) => {
  const { id } = req;
  try {
    const totalSale = await SellerWalletModal.aggregate([
      {
        $match: {
          sellerId: {
            $eq: id,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalProduct = await productModal
      .find({
        sellerId: new ObjectId(id),
      })
      .countDocuments();
    const totalOrder = await adminOrderModal
      .find({
        sellerId: new ObjectId(id),
      })
      .countDocuments();
    const totalPendingOrder = await adminOrderModal
      .find({
        $and: [
          {
            sellerId: {
              $eq: new ObjectId(id),
            },
          },
          {
            delivery_status: {
              $eq: "pending",
            },
          },
        ],
      })
      .countDocuments();

    const recentOrder = await adminOrderModal
      .find({
        sellerId: new ObjectId(id),
      })
      .limit(5);
    responseReturn(res, 200, {
      totalOrder,
      totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
      totalPendingOrder,
      recentOrder,
      totalProduct,
    });
  } catch (error) {
    console.log("get seller dashboard data error" + error.message);
  }
};

module.exports.get_admin_index_data = async (req, res) => {
  const { id } = req;
  try {
    const totalSale = await myShopWalletModal.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalProduct = await productModal.find({}).countDocuments();
    const totalOrder = await customerOrderModal.find({}).countDocuments();
    const totalSeller = await sellerModal.find({}).countDocuments();
    const recentOrder = await customerOrderModal.find({}).limit(5);

    responseReturn(res, 200, {
      totalOrder,
      totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
      totalSeller,
      recentOrder,
      totalProduct,
    });
  } catch (error) {
    console.log("get admin dashboard data error" + error.message);
  }
};
