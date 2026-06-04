const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  searchOrders,
  filterOrdersByDate,
  downloadOrderPDF,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/search", searchOrders);

router.get("/filter", filterOrdersByDate);

router.get("/pdf/:id", downloadOrderPDF);

router.delete("/:id", deleteOrder);

router.get("/:id", getOrderById);

module.exports = router;