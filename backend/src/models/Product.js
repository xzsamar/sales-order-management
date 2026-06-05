const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
    },

    productName: {
      type: String,
      required: true,
    },

    genericName: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    strength: {
  type: String,
  default: "",
},

dosageForm: {
  type: String,
  default: "",
},

    category: {
      type: String,
      required: true,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    focBuyQty: {
      type: Number,
      default: 0,
    },

    focFreeQty: {
      type: Number,
      default: 0,
    },

    availableQty: {
      type: Number,
      default: 0,
    },

    reservedQty: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
    
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);