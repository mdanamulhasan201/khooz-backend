const { Schema, model } = require("mongoose");

const sellerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false, //password access jate na paua jai
    },

    role: {
      type: String,
      default: "seller",
    },
    status: {
      type: String,
      default: "pending",
    },
    payment: {
      type: String,
      default: "inactive",
    },
    //   method means seller kivabe register korteche (facebook, google or manually)
    method: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    shopInfo: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

sellerSchema.index(
  {
    name: "text",
    email: "text",
  },
  {
    weights: {
      name: 2,
      email: 5,
    },
  }
);

module.exports = model("seller", sellerSchema);
