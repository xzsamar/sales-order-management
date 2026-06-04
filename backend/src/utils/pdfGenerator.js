const PDFDocument = require("pdfkit");

const generateOrderPDF = (order, res) => {
  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${order.bookingNumber}.pdf`
  );

  doc.pipe(res);

  doc
    .fontSize(22)
    .text("Sales Order", {
      align: "center",
    });

  doc.moveDown();

  doc.fontSize(14).text("Company Information");

  doc.text("Tech Ecosystem LLC");
  doc.text("Muscat, Oman");

  doc.moveDown();

  doc.text(
    `Order Number: ${order.bookingNumber}`
  );

  doc.text(
    `Customer: ${order.customer.customerName}`
  );

  doc.text(
    `Sales Person: ${order.salesPerson}`
  );

  doc.text(
    `Delivery Date: ${new Date(
      order.deliveryDate
    ).toDateString()}`
  );

  doc.moveDown();

  doc.text("Products");

  doc.moveDown();

  order.items.forEach((item) => {
    doc.text(
      `${item.product.productName} | Qty: ${item.quantity} | Rate: ${item.rate} | Discount: ${item.discount} | FOC: ${item.focQuantity}`
    );
  });

  doc.moveDown();

  doc.text(
    `Gross Amount: ${order.grossAmount}`
  );

  doc.text(
    `Discount: ${order.totalDiscount}`
  );

  doc.text(`FOC: ${order.totalFOC}`);

  doc.text(
    `Grand Total: ${order.grandTotal}`
  );

  doc.end();
};

module.exports = generateOrderPDF;