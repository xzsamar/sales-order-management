const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

const generateOrderPDF = require("../utils/pdfGenerator");
const sendOrderEmail = require("../services/emailService");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      salesPerson,
      deliveryDate,
      remarks,
      items,
    } = req.body;

    if (!customer) {
      return res.status(400).json({
        message: "Customer is required",
      });
    }

    if (!deliveryDate) {
      return res.status(400).json({
        message: "Delivery date is required",
      });
    }

    const customerData = await Customer.findById(customer);

    if (!customerData) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    if (customerData.status === "Inactive") {
      return res.status(400).json({
        message: "Inactive customer",
      });
    }

    let grossAmount = 0;
    let totalDiscount = 0;
    let totalFOC = 0;

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.status === "Inactive") {
        return res.status(400).json({
          message: `${product.productName} is inactive`,
        });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({
          message: "Quantity must be greater than 0",
        });
      }

    if (item.quantity > product.availableQty) {

  let alternatives = await Product.find({
    genericName: product.genericName,
    availableQty: { $gt: 0 },
    status: "Active",
    _id: { $ne: product._id },
  }).select(
    "productName brand availableQty unitPrice"
  );

  // If no same generic products found,
  // suggest same category products
  if (alternatives.length === 0) {
    alternatives = await Product.find({
      category: product.category,
      availableQty: { $gt: 0 },
      status: "Active",
      _id: { $ne: product._id },
    })
      .limit(5)
      .select(
        "productName brand availableQty unitPrice"
      );
  }

  return res.status(400).json({
    message: `Insufficient stock for ${product.productName}`,
    alternatives,
  });
}
      const itemGross =
        item.quantity * product.unitPrice;

      const discountAmount =
        (itemGross *
          (product.discountPercentage || 0)) /
        100;

      let focQty = 0;

      if (
        product.focBuyQty > 0 &&
        product.focFreeQty > 0
      ) {
        focQty =
          Math.floor(
            item.quantity / product.focBuyQty
          ) * product.focFreeQty;
      }

      const lineTotal =
        itemGross - discountAmount;

      grossAmount += itemGross;
      totalDiscount += discountAmount;
      totalFOC += focQty;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        focQuantity: focQty,
        rate: product.unitPrice,
        discount: discountAmount,
        lineTotal,
      });

      product.availableQty -= item.quantity;

      await product.save();
    }

    const grandTotal =
      grossAmount - totalDiscount;

      const totalExposure =
  (customerData.outstandingAmount || 0) +
  grandTotal;

if (
  totalExposure >
  (customerData.creditLimit || 0)
) {
  return res.status(400).json({
    message:
      `Credit limit exceeded.\n` +
      `Credit Limit: OMR ${customerData.creditLimit.toFixed(3)}\n` +
      `Outstanding: OMR ${(customerData.outstandingAmount || 0).toFixed(3)}\n` +
      `Order Amount: OMR ${grandTotal.toFixed(3)}\n` +
      `Total Exposure: OMR ${totalExposure.toFixed(3)}`
  });
}

    const bookingNumber = `SO-${Date.now()}`;

    const order = await Order.create({
  bookingNumber,
  customer,
  salesPerson,
  deliveryDate,
  remarks,
  items: orderItems,
  grossAmount,
  totalDiscount,
  totalFOC,
  grandTotal,
});

customerData.outstandingAmount =
  (customerData.outstandingAmount || 0) +
  grandTotal;

await customerData.save();

const populatedOrder =
  await Order.findById(order._id)
    .populate("customer")
    .populate("items.product");

console.log(
  "Order saved:",
  order.bookingNumber
);

res.status(201).json(order);

setImmediate(async () => {
  try {
    console.log(
      "Starting email process..."
    );

    await sendOrderEmail(
      populatedOrder
    );

    console.log(
      "Email sent successfully"
    );
  } catch (error) {
    console.error(
      "Email error:",
      error
    );
  }
});

return;
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("items.product");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ORDER BY ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate("customer")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SEARCH ORDERS
const searchOrders = async (req, res) => {
  try {
    const { bookingNumber, customer } =
      req.query;

    let query = {};

    if (bookingNumber) {
      query.bookingNumber = {
        $regex: bookingNumber,
        $options: "i",
      };
    }

    if (customer) {
      query.customer = customer;
    }

    const orders = await Order.find(query)
      .populate("customer")
      .populate("items.product");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// FILTER BY DATE
const filterOrdersByDate = async (
  req,
  res
) => {
  try {
    const { startDate, endDate } =
      req.query;

    const orders = await Order.find({
      orderDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
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

// PDF DOWNLOAD
const downloadOrderPDF = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate("customer")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    generateOrderPDF(order, res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    for (const item of order.items) {
      const product = await Product.findById(
        item.product._id
      );

      if (product) {
        product.availableQty += item.quantity;
        await product.save();
      }
    }

    await Order.findByIdAndDelete(
      req.params.id
    );

    const customer = await Customer.findById(
  order.customer
);

if (customer) {
  customer.outstandingAmount -=
    order.grandTotal;

  if (customer.outstandingAmount < 0) {
    customer.outstandingAmount = 0;
  }

  await customer.save();
}

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  searchOrders,
  filterOrdersByDate,
  downloadOrderPDF,
  deleteOrder,
};