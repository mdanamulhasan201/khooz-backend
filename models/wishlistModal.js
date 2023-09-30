const { Schema, model } = require("mongoose");

const wishlistSchema = new Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    productId: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    discount: {
      type: Number,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    rating: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = model("wishlists", wishlistSchema);
