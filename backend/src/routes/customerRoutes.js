const express = require("express");

const router = express.Router();

const {
  getCustomers,
  getCustomerById,
  searchCustomers,
  getCustomerPurchaseHistory,
} = require("../controllers/customerController");

router.get("/", getCustomers);

router.get("/search", searchCustomers);

router.get(
  "/:id/history",
  getCustomerPurchaseHistory
);

router.get("/:id", getCustomerById);

module.exports = router;