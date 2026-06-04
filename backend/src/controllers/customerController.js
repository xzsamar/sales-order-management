const Customer = require("../models/Customer");
const Order = require("../models/Order");

// GET ALL CUSTOMERS
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CUSTOMER BY ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SEARCH CUSTOMER
const searchCustomers = async (req, res) => {
  try {
    const { keyword } = req.query;

    const customers = await Customer.find({
      $or: [
        {
          customerName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          customerCode: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CUSTOMER PURCHASE HISTORY
const getCustomerPurchaseHistory =
  async (req, res) => {
    try {
      const orders = await Order.find({
        customer: req.params.id,
      })
        .populate("customer")
        .populate("items.product");

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  getCustomers,
  getCustomerById,
  searchCustomers,
  getCustomerPurchaseHistory,
};