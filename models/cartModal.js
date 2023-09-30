const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      require: true,
    },
    productId: {
      type: Schema.ObjectId,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = model("cartProducts", cartSchema);
