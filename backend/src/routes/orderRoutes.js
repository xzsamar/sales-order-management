const express = require("express");

const router = express.Router();

const sendOrderEmail = require("../services/emailService");

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

router.get("/test-email", async (req, res) => {
  try {
    await sendOrderEmail({
      bookingNumber: "TEST123",
      customer: {
        customerName: "Test Customer",
      },
      salesPerson: "Samar",
      deliveryDate: new Date(),
      grandTotal: 100,
    });

    res.send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;