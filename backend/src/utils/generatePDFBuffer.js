const PDFDocument = require("pdfkit");

const generatePDFBuffer = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    doc.on("error", reject);

    // =========================
    // HEADER
    // =========================

    doc
      .rect(0, 0, 595, 80)
      .fill("#2563eb");

    doc
      .fillColor("white")
      .fontSize(24)
      .text("SALES ORDER", 40, 28);

    doc
      .fontSize(11)
      .text("Tech Ecosystem LLC", 400, 25, {
        align: "right",
      });

    doc
      .text("Muscat, Oman", 400, 42, {
        align: "right",
      });

    doc.fillColor("black");

    doc.moveDown(4);

    // =========================
    // CUSTOMER DETAILS
    // =========================

    doc
      .fontSize(15)
      .fillColor("#2563eb")
      .text("Customer Information");

    doc.fillColor("black");

    doc
      .rect(40, 120, 515, 75)
      .stroke("#d1d5db");

    doc
      .fontSize(11)
      .text(
        `Customer Name: ${
          order.customer?.customerName ||
          "N/A"
        }`,
        50,
        135
      );

    doc.text(
      `Customer Code: ${
        order.customer?.customerCode ||
        "N/A"
      }`,
      50,
      155
    );

    doc.text(
      `Email: ${
        order.customer?.email || "N/A"
      }`,
      280,
      135
    );

    doc.text(
      `Phone: ${
        order.customer?.phone || "N/A"
      }`,
      280,
      155
    );

    // =========================
    // ORDER DETAILS
    // =========================

    doc.moveDown(4);

    doc
      .fontSize(15)
      .fillColor("#2563eb")
      .text("Order Details", 40, 220);

    doc.fillColor("black");

    doc
      .rect(40, 245, 515, 90)
      .stroke("#d1d5db");

    doc.text(
      `Booking Number: ${
        order.bookingNumber
      }`,
      50,
      260
    );

    doc.text(
      `Sales Person: ${
        order.salesPerson || "N/A"
      }`,
      50,
      280
    );

    doc.text(
      `Order Date: ${
        order.orderDate
          ? new Date(
              order.orderDate
            ).toLocaleDateString()
          : "N/A"
      }`,
      300,
      260
    );

    doc.text(
      `Delivery Date: ${
        order.deliveryDate
          ? new Date(
              order.deliveryDate
            ).toLocaleDateString()
          : "N/A"
      }`,
      300,
      280
    );

    // =========================
    // PRODUCTS TABLE
    // =========================

    let tableTop = 370;

    doc
      .fontSize(15)
      .fillColor("#2563eb")
      .text("Products", 40, tableTop);

    tableTop += 25;

    doc
      .rect(40, tableTop, 515, 25)
      .fill("#2563eb");

    doc.fillColor("white");

    doc.fontSize(10);

    doc.text("#", 50, tableTop + 7);
    doc.text(
      "Product",
      80,
      tableTop + 7
    );
    doc.text(
      "Qty",
      260,
      tableTop + 7
    );
    doc.text(
      "Rate",
      320,
      tableTop + 7
    );
    doc.text(
      "Discount",
      390,
      tableTop + 7
    );
    doc.text(
      "Total",
      490,
      tableTop + 7
    );

    let y = tableTop + 30;

    doc.fillColor("black");

    order.items.forEach(
      (item, index) => {
        doc.text(
          index + 1,
          50,
          y
        );

        doc.text(
          item.product?.productName ||
            "N/A",
          80,
          y,
          { width: 160 }
        );

        doc.text(
          item.quantity,
          260,
          y
        );

        doc.text(
          Number(item.rate).toFixed(3),
          320,
          y
        );

        doc.text(
          Number(
            item.discount
          ).toFixed(3),
          390,
          y
        );

        doc.text(
          Number(
            item.lineTotal
          ).toFixed(3),
          490,
          y
        );

        y += 25;
      }
    );

    // =========================
    // SUMMARY
    // =========================

    y += 20;

    doc
      .rect(330, y, 225, 100)
      .stroke("#d1d5db");

    doc.fontSize(11);

    doc.text(
      `Gross Amount: OMR ${Number(
        order.grossAmount || 0
      ).toFixed(3)}`,
      345,
      y + 15
    );

    doc.text(
      `Total Discount: OMR ${Number(
        order.totalDiscount || 0
      ).toFixed(3)}`,
      345,
      y + 35
    );

    doc.text(
      `Total FOC: ${order.totalFOC || 0}`,
      345,
      y + 55
    );

    doc
      .fontSize(12)
      .fillColor("#16a34a")
      .text(
        `Grand Total: OMR ${Number(
          order.grandTotal || 0
        ).toFixed(3)}`,
        345,
        y + 75
      );

    doc.fillColor("black");

    // =========================
    // REMARKS
    // =========================

    y += 140;

    doc
      .fontSize(14)
      .fillColor("#2563eb")
      .text("Remarks");

    doc.fillColor("black");

    doc
      .rect(40, y + 25, 515, 50)
      .stroke("#d1d5db");

    doc.text(
      order.remarks ||
        "No remarks provided.",
      50,
      y + 40
    );

    // =========================
    // SIGNATURES
    // =========================

    y += 120;

    doc.text(
      "Prepared By",
      60,
      y
    );

    doc.text(
      "Approved By",
      250,
      y
    );

    doc.text(
      "Customer Signature",
      420,
      y
    );

    doc.moveTo(40, y + 30)
      .lineTo(160, y + 30)
      .stroke();

    doc.moveTo(220, y + 30)
      .lineTo(340, y + 30)
      .stroke();

    doc.moveTo(400, y + 30)
      .lineTo(540, y + 30)
      .stroke();

    // =========================
    // FOOTER
    // =========================

    doc
      .fontSize(9)
      .fillColor("gray")
      .text(
        `Generated on ${new Date().toLocaleString()}`,
        40,
        770
      );

    doc.text(
      "Sales Order Management System | Developed by Samar Ahmed",
      40,
      785,
      {
        align: "center",
      }
    );

    doc.end();
  });
};

module.exports = generatePDFBuffer;