const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerCode: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    contactPerson: {
      type: String,
      default: "",
    },

    mobileNumber: {
      type: String,
      default: "",
    },

    address: {
      country: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      area: {
        type: String,
        default: "",
      },

      zipcode: {
        type: String,
        default: "",
      },

      googleMapUrl: {
        type: String,
        default: "",
      },
    },

    creditLimit: {
      type: Number,
      default: 100,
    },

    outstandingAmount: {
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

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;