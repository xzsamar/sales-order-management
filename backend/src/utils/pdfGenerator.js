const PDFDocument = require("pdfkit");

// ─── Color Palette ───────────────────────────────────────────────
const COLORS = {
  headerBg:      "#0f172a",
  accentStrong:  "#f59e0b",
  accentSoft:    "#fbbf24",
  sectionTitle:  "#f59e0b",
  tableHeader:   "#1e293b",
  tableRowAlt:   "#f8fafc",
  tableBorder:   "#cbd5e1",
  bodyText:      "#1e293b",
  mutedText:     "#64748b",
  summaryBg:     "#0f172a",
  white:         "white",
  divider:       "#e2e8f0",
  footerBg:      "#1e293b",
  footerText:    "#94a3b8",
};

const PAGE_W    = 595;
const MARGIN    = 40;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ─── Helpers ─────────────────────────────────────────────────────
const filledRect = (doc, x, y, w, h, color) =>
  doc.rect(x, y, w, h).fill(color);

const hRule = (doc, x, y, w, color = COLORS.divider, lw = 0.5) =>
  doc.lineWidth(lw).moveTo(x, y).lineTo(x + w, y).stroke(color);

const infoRow = (doc, label, value, x, y, colW = 110) => {
  doc.fontSize(8).fillColor(COLORS.mutedText).font("Helvetica")
    .text(label.toUpperCase(), x, y);
  doc.fontSize(10).fillColor(COLORS.bodyText).font("Helvetica-Bold")
    .text(value || "N/A", x, y + 11, { width: colW });
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

// ─── Main Export ─────────────────────────────────────────────────

const generateOrderPDF = (order, res) => {
  try {
    const doc = new PDFDocument({ margin: 0, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${order.bookingNumber || "order"}.pdf`
    );

    doc.on("error", (err) => {
      console.error("PDF stream error:", err);
    });

    doc.pipe(res);

    // ═══════════════════════════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════════════════════════
    filledRect(doc, 0, 0, PAGE_W, 90, COLORS.headerBg);
    filledRect(doc, 0, 0, 5, 90, COLORS.accentStrong); // gold left bar

    doc
      .fontSize(26)
      .fillColor(COLORS.white)
      .font("Helvetica-Bold")
      .text("SALES ORDER", MARGIN + 8, 20);

    doc
      .fontSize(9)
      .fillColor(COLORS.accentSoft)
      .font("Helvetica")
      .text(`REF: ${order.bookingNumber || "—"}`, MARGIN + 8, 52);

    doc
      .fontSize(11)
      .fillColor(COLORS.white)
      .font("Helvetica-Bold")
      .text("Tech Ecosystem LLC", 0, 22, { width: PAGE_W - MARGIN, align: "right" });

    doc
      .fontSize(9)
      .fillColor(COLORS.mutedText)
      .font("Helvetica")
      .text("Muscat, Oman", 0, 38, { width: PAGE_W - MARGIN, align: "right" });

    // Gold divider below header
    filledRect(doc, 0, 90, PAGE_W, 3, COLORS.accentStrong);

    // ═══════════════════════════════════════════════════════════
    // INFO CARDS
    // ═══════════════════════════════════════════════════════════
    const cardTop = 104;
    const cardH   = 80;
    const cardGap = 12;
    const halfW   = (CONTENT_W - cardGap) / 2;

    // Card backgrounds
    filledRect(doc, MARGIN, cardTop, halfW, cardH, "#f1f5f9");
    filledRect(doc, MARGIN + halfW + cardGap, cardTop, halfW, cardH, "#f1f5f9");
    // Gold top-bar accent on both cards
    filledRect(doc, MARGIN, cardTop, halfW, 3, COLORS.accentStrong);
    filledRect(doc, MARGIN + halfW + cardGap, cardTop, halfW, 3, COLORS.accentStrong);

    // Customer card
    doc.fontSize(8).fillColor(COLORS.mutedText).font("Helvetica-Bold")
      .text("CUSTOMER INFORMATION", MARGIN + 10, cardTop + 10);
    infoRow(doc, "Name",  order.customer?.customerName, MARGIN + 10,       cardTop + 24);
    infoRow(doc, "Code",  order.customer?.customerCode, MARGIN + 10 + 130, cardTop + 24);
    infoRow(doc, "Email", order.customer?.email,        MARGIN + 10,       cardTop + 52);
    infoRow(doc, "Phone", order.customer?.phone,        MARGIN + 10 + 130, cardTop + 52);

    // Order details card
    const ox = MARGIN + halfW + cardGap + 10;
    doc.fontSize(8).fillColor(COLORS.mutedText).font("Helvetica-Bold")
      .text("ORDER DETAILS", ox, cardTop + 10);
    infoRow(doc, "Booking #",     order.bookingNumber,      ox,       cardTop + 24);
    infoRow(doc, "Sales Person",  order.salesPerson,        ox + 130, cardTop + 24);
    infoRow(doc, "Order Date",    fmtDate(order.orderDate), ox,       cardTop + 52);
    infoRow(doc, "Delivery Date", fmtDate(order.deliveryDate), ox + 130, cardTop + 52);

    // ═══════════════════════════════════════════════════════════
    // PRODUCTS SECTION
    // ═══════════════════════════════════════════════════════════
    const secY = cardTop + cardH + 18;

    doc.fontSize(11).fillColor(COLORS.sectionTitle).font("Helvetica-Bold")
      .text("▎ PRODUCTS", MARGIN, secY);
    hRule(doc, MARGIN, secY + 16, CONTENT_W, COLORS.accentStrong, 1);

    // Table header
    const tblTop = secY + 22;
    const rowH   = 22;
    const cols = {
      num:      { x: MARGIN,       w: 28  },
      product:  { x: MARGIN + 28,  w: 168 },
      qty:      { x: MARGIN + 196, w: 50  },
      rate:     { x: MARGIN + 246, w: 75  },
      discount: { x: MARGIN + 321, w: 75  },
      total:    { x: MARGIN + 396, w: 79  },
    };

    filledRect(doc, MARGIN, tblTop, CONTENT_W, rowH, COLORS.tableHeader);
    doc.fontSize(8).fillColor(COLORS.accentSoft).font("Helvetica-Bold");
    [
      ["#",        cols.num],
      ["PRODUCT",  cols.product],
      ["QTY",      cols.qty],
      ["RATE",     cols.rate],
      ["DISCOUNT", cols.discount],
      ["TOTAL",    cols.total],
    ].forEach(([label, col]) =>
      doc.text(label, col.x + 4, tblTop + 7, { width: col.w - 8 })
    );

    // Table rows
    let y = tblTop + rowH;
    doc.font("Helvetica");

    const items = order.items || [];
    if (items.length === 0) {
      filledRect(doc, MARGIN, y, CONTENT_W, rowH, COLORS.tableRowAlt);
      doc.fontSize(9).fillColor(COLORS.mutedText).text("No products available.", MARGIN + 10, y + 6);
      y += rowH;
    } else {
      items.forEach((item, i) => {
        const bg = i % 2 === 0 ? COLORS.white : COLORS.tableRowAlt;
        filledRect(doc, MARGIN, y, CONTENT_W, rowH, bg);

        doc.fontSize(9).fillColor(COLORS.bodyText);
        doc.text(String(i + 1),                     cols.num.x + 4,      y + 6);
        doc.text(item.product?.productName || "N/A", cols.product.x + 4,  y + 6, { width: cols.product.w - 8 });
        doc.text(String(item.quantity || 0),         cols.qty.x + 4,      y + 6);
        doc.text(Number(item.rate || 0).toFixed(3),  cols.rate.x + 4,     y + 6);
        doc.text(`${Number(item.discount || 0).toFixed(1)}%`, cols.discount.x + 4, y + 6);
        doc.text(String(item.focQuantity || 0),      cols.total.x + 4,    y + 6);  // FOC in total col for this file

        hRule(doc, MARGIN, y + rowH, CONTENT_W, COLORS.tableBorder, 0.3);
        y += rowH;
      });
    }

    // ═══════════════════════════════════════════════════════════
    // SUMMARY + REMARKS
    // ═══════════════════════════════════════════════════════════
    y += 20;

    const sumW = 195;
    const sumX = MARGIN + CONTENT_W - sumW;

    const sumLines = [
      { label: "Gross Amount",   value: `OMR ${Number(order.grossAmount   || 0).toFixed(3)}` },
      { label: "Total Discount", value: `OMR ${Number(order.totalDiscount || 0).toFixed(3)}` },
      { label: "Total FOC",      value: String(order.totalFOC             || 0) },
    ];
    const lineH = 22;
    const sumH  = lineH * sumLines.length + 34;

    filledRect(doc, sumX, y, sumW, sumH, COLORS.summaryBg);
    filledRect(doc, sumX, y, 4, sumH, COLORS.accentStrong);

    let sy = y + 10;
    sumLines.forEach(({ label, value }) => {
      doc.fontSize(8).fillColor(COLORS.mutedText).font("Helvetica").text(label, sumX + 12, sy);
      doc.fontSize(9).fillColor(COLORS.white).font("Helvetica-Bold")
        .text(value, sumX + 12, sy, { width: sumW - 20, align: "right" });
      sy += lineH;
    });

    // Grand total
    filledRect(doc, sumX, sy, sumW, 28, COLORS.accentStrong);
    doc.fontSize(9).fillColor(COLORS.headerBg).font("Helvetica-Bold").text("GRAND TOTAL", sumX + 12, sy + 8);
    doc.fontSize(11).fillColor(COLORS.headerBg).font("Helvetica-Bold")
      .text(`OMR ${Number(order.grandTotal || 0).toFixed(3)}`, sumX + 12, sy + 7, {
        width: sumW - 20, align: "right",
      });

    // Remarks
    doc.fontSize(9).fillColor(COLORS.mutedText).font("Helvetica-Bold")
      .text("REMARKS", MARGIN, y);
    filledRect(doc, MARGIN, y + 14, sumX - MARGIN - 12, 44, "#f8fafc");
    filledRect(doc, MARGIN, y + 14, 3, 44, COLORS.accentStrong);
    doc.fontSize(9).fillColor(COLORS.bodyText).font("Helvetica")
      .text(order.remarks || "No remarks provided.", MARGIN + 10, y + 22, {
        width: sumX - MARGIN - 22, height: 34, ellipsis: true,
      });

    // ═══════════════════════════════════════════════════════════
    // SIGNATURES
    // ═══════════════════════════════════════════════════════════
    const sigY = Math.max(y + sumH, y + 14 + 44) + 28;

    hRule(doc, MARGIN, sigY, CONTENT_W, COLORS.divider, 0.5);

    ["Prepared By", "Approved By", "Customer Signature"].forEach((label, i) => {
      const sx = MARGIN + i * (CONTENT_W / 3);
      hRule(doc, sx + 10, sigY + 30, CONTENT_W / 3 - 24, COLORS.accentStrong, 1);
      doc.fontSize(8).fillColor(COLORS.mutedText).font("Helvetica")
        .text(label, sx, sigY + 36, { width: CONTENT_W / 3 - 4, align: "center" });
    });

    // ═══════════════════════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════════════════════
    filledRect(doc, 0, 810, PAGE_W, 32, COLORS.footerBg);
    filledRect(doc, 0, 810, PAGE_W, 2,  COLORS.accentStrong);

    doc.fontSize(7.5).fillColor(COLORS.footerText).font("Helvetica")
      .text(
        `Generated on ${new Date().toLocaleString()}   ·   Sales Order Management System   ·   Developed by Samar Ahmed`,
        MARGIN, 819,
        { width: CONTENT_W, align: "center" }
      );

    doc.end();

  } catch (error) {
    console.error("PDF Generation Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  }
};

module.exports = generateOrderPDF;
