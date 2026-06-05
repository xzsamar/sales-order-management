const PDFDocument = require("pdfkit");

const generatePDFBuffer = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    const buffers = [];

    doc.on("data", (chunk) =>
      buffers.push(chunk)
    );

    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.on("error", reject);

    doc
      .fontSize(22)
      .text("Sales Order", {
        align: "center",
      });

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

    doc.moveDown();

    order.items.forEach((item) => {
      doc.text(
        `${item.product?.productName || ""} - Qty: ${item.quantity}`
      );
    });

    doc.moveDown();

    doc.text(
      `Grand Total: OMR ${order.grandTotal}`
    );

    doc.end();
  });
};

module.exports = generatePDFBuffer;