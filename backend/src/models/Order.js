const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  focQuantity: {
    type: Number,
    default: 0,
  },

  rate: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
    default: 0,
  },

  lineTotal: {
    type: Number,
    default: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    salesPerson: {
      type: String,
      required: true,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },

    items: [orderItemSchema],

    grossAmount: {
      type: Number,
      default: 0,
    },

    totalDiscount: {
      type: Number,
      default: 0,
    },

    totalFOC: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);