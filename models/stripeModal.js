const { Schema, model } = require("mongoose");

const paymentStripesSchema = new Schema(
  {
    sellerId: {
      type: Schema.ObjectId,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("paymentStripe", paymentStripesSchema);
