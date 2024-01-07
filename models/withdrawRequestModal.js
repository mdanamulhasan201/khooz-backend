const { Schema, model } = require("mongoose");

const withdrawSchema = new Schema(
  {
    sellerId: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
   
  },
  { timestamps: true }
);

module.exports = model("withdrawRequest", withdrawSchema);
