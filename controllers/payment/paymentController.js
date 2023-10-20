const { v4: uuidv4 } = require("uuid");
const stripeModal = require("../../models/stripeModal");
const { responseReturn } = require("../../utiles/response");
const sellerModal = require("../../models/sellerModal");
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
    const {id} = req
    try {
        const userStripeInfo = await stripeModal.findOne({code : activeCode})
        if(userStripeInfo){
            await sellerModal.findByIdAndUpdate(id,{
                payment : 'active'
            })
            responseReturn(res, 200, { message: 'Payment active' });
        }else{
            responseReturn(res, 404, { message: 'Payment active failed' });
        }
    } catch (error) {
         responseReturn(res, 500, { message: 'Internal server error' });
    }
  };
}

module.exports = new paymentController();
