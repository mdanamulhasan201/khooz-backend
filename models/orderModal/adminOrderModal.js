const { Schema, model } = require("mongoose");

const adminOrderModalSchema = new Schema(
  {
    orderId: {
      type: Schema.ObjectId,
      require: true,
    },
    sellerId: {
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
      type: String,
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

module.exports = model("adminOrders", adminOrderModalSchema);
