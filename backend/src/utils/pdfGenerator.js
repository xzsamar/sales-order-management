const PDFDocument = require("pdfkit");

const generateOrderPDF = (order, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${order.bookingNumber}.pdf`
  );

  doc.on("error", (err) => {
    console.error("PDF Error:", err);
  });

  res.on("error", (err) => {
    console.error("Response Error:", err);
  });

  doc.pipe(res);

  doc.fontSize(22).text("Sales Order", {
    align: "center",
  });

  // ... rest of your PDF content ...

  doc.end();
};

module.exports = generateOrderPDF;