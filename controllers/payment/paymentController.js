const { v4: uuidv4 } = require("uuid");
const stripeModal = require("../../models/stripeModal");
const { responseReturn } = require("../../utiles/response");
const sellerModal = require("../../models/sellerModal");
const SellerWalletModal = require("../../models/SellerWalletModal");
const withdrawRequestModal = require("../../models/withdrawRequestModal");
const {
  mongo: { ObjectId },
} = require("mongoose");

const stripe = require("stripe")(
  "sk_test_51O2od3Hytm0jO8z5ka96mMf4lE28k5MhqdCmfkfe1sIbRiXemRgVieQMjpbilZbeOmJTURFmRzTKgMuOD1SGogxt00eiGZz4jp"
);

class paymentController {
  create_stripe_connect_account = async (req, res) => {
    const { id } = req;
    const uid = uuidv4();
    try {
      const stripeInfo = await stripeModal.findOne({ sellerId: id });
      if (stripeInfo) {
        await stripeModal.deleteOne({ sellerId: id });
        const account = await stripe.accounts.create({ type: "express" });

        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: "http://localhost:3001/refresh",
          return_url: `http://localhost:3000/success?activeCode=${uid}`,
          type: "account_onboarding",
        });
        await stripeModal.create({
          sellerId: id,
          stripeId: account.id,
          code: uid,
        });
        responseReturn(res, 201, { url: accountLink.url });
      } else {
        const account = await stripe.accounts.create({ type: "express" });

        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: "http://localhost:3001/refresh",
          return_url: `http://localhost:3000/success?activeCode=${uid}`,
          type: "account_onboarding",
        });
        await stripeModal.create({
          sellerId: id,
          stripeId: account.id,
          code: uid,
        });
        responseReturn(res, 201, { url: accountLink.url });
      }
    } catch (error) {
      console.log("stripe connect account create error " + error.message);
    }
  };

  active_stripe_connect_account = async (req, res) => {
    const { activeCode } = req.params;
    const { id } = req;
    try {
      const userStripeInfo = await stripeModal.findOne({ code: activeCode });
      if (userStripeInfo) {
        await sellerModal.findByIdAndUpdate(id, {
          payment: "active",
        });
        responseReturn(res, 200, { message: "Payment active" });
      } else {
        responseReturn(res, 404, { message: "Payment active failed" });
      }
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  sumAmount = (data) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum = sum + data[i].amount;
    }
    return sum;
  };

  get_seller_payment_details = async (req, res) => {
    const { sellerId } = req.params;
    try {
      const payments = await SellerWalletModal.find({ sellerId });
      const pendingWithdraws = await withdrawRequestModal.find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "pending",
            },
          },
        ],
      });

      const successWithdraws = await withdrawRequestModal.find({
        $and: [
          {
            sellerId: {
              $eq: sellerId,
            },
          },
          {
            status: {
              $eq: "success",
            },
          },
        ],
      });

      const pendingAmount = this.sumAmount(pendingWithdraws);
      const withdrawAmount = this.sumAmount(successWithdraws);
      const totalAmount = this.sumAmount(payments);
      let availableAmount = 0;

      if (totalAmount > 0) {
        availableAmount = totalAmount - (pendingAmount + withdrawAmount);
      }
      responseReturn(res, 200, {
        totalAmount,
        pendingAmount,
        withdrawAmount,
        availableAmount,
        successWithdraws,
        pendingWithdraws,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  send_withdraw_Request = async (req, res) => {
    const { amount, sellerId } = req.body;
    try {
      const withdraw = await withdrawRequestModal.create({
        sellerId,
        amount: parseInt(amount),
      });
      responseReturn(res, 200, { withdraw, message: "withdraw request send" });
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  get_payment_request = async (req, res) => {
  

    try {
      const withdrawRequest = await withdrawRequestModal.find({
        status: "pending",
      });
      responseReturn(res, 200, { withdrawRequest });
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };

  payment_request_confirm = async (req, res) => {
    const { paymentId } = req.body;
    
    try {
      const payment = await withdrawRequestModal.findById(paymentId);
      const { stripeId } = await stripeModal.findOne({
        sellerId: new ObjectId(payment.sellerId),
      });
      await stripe.transfers.create({
        amount: payment.amount * 100,
        currency: "bdt",
        destination: stripeId,
      });
      await withdrawRequestModal.findByIdAndUpdate(paymentId, {
        status: "success",
      });
    
      responseReturn(res, 200, { payment, message: 'request confirm success' });
    } catch (error) {
      responseReturn(res, 500, { message: "Internal server error" });
    }
  };
}

module.exports = new paymentController();
