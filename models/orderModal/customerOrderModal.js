const { Schema, model } = require("mongoose");

const customerOrderModal = new Schema(
  {
    customerId: {
      type: Schema.ObjectId,
      require: true,
    },
    products: {
      type: Array,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    payment_status: {
      type: String,
      require: true,
    },
    shippingInfo: {
      type: Object,
      require: true,
    },
    delivery_status: {
      type: Object,
      require: true,
    },
    date: {
      type: Object,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = model("customerOrder", customerOrderModal);
