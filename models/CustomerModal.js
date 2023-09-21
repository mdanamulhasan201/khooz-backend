const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
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

    method: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

module.exports = model("customers", customerSchema);
