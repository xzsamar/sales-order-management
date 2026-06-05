const PDFDocument = require("pdfkit");

// ─── Color Palette ───────────────────────────────────────────────
const COLORS = {
  headerBg:      "#0f172a",   // near-black navy
  accentStrong:  "#f59e0b",   // amber gold
  accentSoft:    "#fbbf24",   // lighter gold
  sectionTitle:  "#f59e0b",
  tableHeader:   "#1e293b",   // dark slate
  tableRowAlt:   "#f8fafc",   // very light grey for alternating rows
  tableBorder:   "#cbd5e1",
  bodyText:      "#1e293b",
  mutedText:     "#64748b",
  summaryBg:     "#0f172a",
  summaryText:   "white",
  grandTotal:    "#f59e0b",
  footerBg:      "#1e293b",
  footerText:    "#94a3b8",
  divider:       "#e2e8f0",
  white:         "white",
};

// ─── Layout Constants ────────────────────────────────────────────
const PAGE_W    = 595;
const MARGIN    = 40;
const CONTENT_W = PAGE_W - MARGIN * 2;  // 515

// ─── Helpers ─────────────────────────────────────────────────────

/** Draw a filled rounded rect (PDFKit doesn't have native roundRect, simulate with rect) */
const filledRect = (doc, x, y, w, h, color) => {
  doc.rect(x, y, w, h).fill(color);
};

/** Draw a stroked rect */
const strokedRect = (doc, x, y, w, h, color, lineWidth = 0.5) => {
  doc.lineWidth(lineWidth).rect(x, y, w, h).stroke(color);
};

/** Draw a horizontal rule */
const hRule = (doc, x, y, w, color = COLORS.divider, lw = 0.5) => {
  doc.lineWidth(lw).moveTo(x, y).lineTo(x + w, y).stroke(color);
};

/** Label + value row inside an info box */
const infoRow = (doc, label, value, x, y) => {
  doc.fontSize(8).fillColor(COLORS.mutedText).text(label.toUpperCase(), x, y);
  doc.fontSize(10).fillColor(COLORS.bodyText).text(value || "N/A", x, y + 11, { width: 110 });
};

// ─── Main Export ─────────────────────────────────────────────────

const generatePDFBuffer = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: "A4" });

    const buffers = [];
    doc.on("data",  (chunk) => buffers.push(chunk));
    doc.on("end",   () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // ═══════════════════════════════════════════════════════════
    // HEADER  (full-width dark band)
    // ═══════════════════════════════════════════════════════════
    filledRect(doc, 0, 0, PAGE_W, 90, COLORS.headerBg);

    // Gold accent bar on left edge
    filledRect(doc, 0, 0, 5, 90, COLORS.accentStrong);

    // "SALES ORDER" title
    doc
      .fontSize(26)
      .fillColor(COLORS.white)
      .font("Helvetica-Bold")
      .text("SALES ORDER", MARGIN + 8, 20);

    // Booking number badge
    const bn = order.bookingNumber || "—";
    doc
      .fontSize(9)
      .fillColor(COLORS.accentSoft)
      .font("Helvetica")
      .text(`REF: ${bn}`, MARGIN + 8, 52);

    // Company block (right-aligned)
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

    // ═══════════════════════════════════════════════════════════
    // GOLD DIVIDER
    // ═══════════════════════════════════════════════════════════
    filledRect(doc, 0, 90, PAGE_W, 3, COLORS.accentStrong);

    // ═══════════════════════════════════════════════════════════
    // INFO BAND  (two side-by-side cards)
    // ═══════════════════════════════════════════════════════════
    const cardTop  = 104;
    const cardH    = 80;
    const cardGap  = 12;
    const halfW    = (CONTENT_W - cardGap) / 2;

    // Card backgrounds
    filledRect(doc, MARGIN, cardTop, halfW, cardH, "#f1f5f9");
    filledRect(doc, MARGIN + halfW + cardGap, cardTop, halfW, cardH, "#f1f5f9");

    // Left card accent top bar
    filledRect(doc, MARGIN, cardTop, halfW, 3, COLORS.accentStrong);
    filledRect(doc, MARGIN + halfW + cardGap, cardTop, halfW, 3, COLORS.accentStrong);

    // Customer card
    doc
      .fontSize(8)
      .fillColor(COLORS.mutedText)
      .font("Helvetica-Bold")
      .text("CUSTOMER INFORMATION", MARGIN + 10, cardTop + 10);

    infoRow(doc, "Name",  order.customer?.customerName, MARGIN + 10, cardTop + 24);
    infoRow(doc, "Code",  order.customer?.customerCode, MARGIN + 10 + 130, cardTop + 24);
    infoRow(doc, "Email", order.customer?.email,        MARGIN + 10, cardTop + 52);
    infoRow(doc, "Phone", order.customer?.phone,        MARGIN + 10 + 130, cardTop + 52);

    // Order card
    const ox = MARGIN + halfW + cardGap + 10;
    doc
      .fontSize(8)
      .fillColor(COLORS.mutedText)
      .font("Helvetica-Bold")
      .text("ORDER DETAILS", ox, cardTop + 10);

    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "N/A";

    infoRow(doc, "Booking #",      order.bookingNumber,             ox,        cardTop + 24);
    infoRow(doc, "Sales Person",   order.salesPerson,               ox + 130,  cardTop + 24);
    infoRow(doc, "Order Date",     fmt(order.orderDate),            ox,        cardTop + 52);
    infoRow(doc, "Delivery Date",  fmt(order.deliveryDate),         ox + 130,  cardTop + 52);

    // ═══════════════════════════════════════════════════════════
    // PRODUCTS SECTION HEADER
    // ═══════════════════════════════════════════════════════════
    const secY = cardTop + cardH + 18;

    doc
      .fontSize(11)
      .fillColor(COLORS.sectionTitle)
      .font("Helvetica-Bold")
      .text("▎ PRODUCTS", MARGIN, secY);

    hRule(doc, MARGIN, secY + 16, CONTENT_W, COLORS.accentStrong, 1);

    // ═══════════════════════════════════════════════════════════
    // TABLE HEADER ROW
    // ═══════════════════════════════════════════════════════════
    const tblTop  = secY + 22;
    const rowH    = 22;
    const cols    = {
      num:      { x: MARGIN,       w: 28  },
      product:  { x: MARGIN + 28,  w: 168 },
      qty:      { x: MARGIN + 196, w: 50  },
      rate:     { x: MARGIN + 246, w: 75  },
      discount: { x: MARGIN + 321, w: 75  },
      total:    { x: MARGIN + 396, w: 79  },
    };

    filledRect(doc, MARGIN, tblTop, CONTENT_W, rowH, COLORS.tableHeader);

    doc.fontSize(8).fillColor(COLORS.accentSoft).font("Helvetica-Bold");
    const th = (label, col) => doc.text(label, col.x + 4, tblTop + 7, { width: col.w - 8 });
    th("#",        cols.num);
    th("PRODUCT",  cols.product);
    th("QTY",      cols.qty);
    th("RATE",     cols.rate);
    th("DISCOUNT", cols.discount);
    th("TOTAL",    cols.total);

    // ═══════════════════════════════════════════════════════════
    // TABLE ROWS
    // ═══════════════════════════════════════════════════════════
    let y = tblTop + rowH;
    doc.font("Helvetica");

    (order.items || []).forEach((item, i) => {
      const bg = i % 2 === 0 ? COLORS.white : COLORS.tableRowAlt;
      filledRect(doc, MARGIN, y, CONTENT_W, rowH, bg);

      doc.fontSize(9).fillColor(COLORS.bodyText);
      doc.text(String(i + 1),                              cols.num.x + 4,      y + 6);
      doc.text(item.product?.productName || "N/A",         cols.product.x + 4,  y + 6, { width: cols.product.w - 8 });
      doc.text(String(item.quantity),                      cols.qty.x + 4,      y + 6);
      doc.text(Number(item.rate).toFixed(3),               cols.rate.x + 4,     y + 6);
      doc.text(Number(item.discount).toFixed(3),           cols.discount.x + 4, y + 6);
      doc.text(Number(item.lineTotal).toFixed(3),          cols.total.x + 4,    y + 6);

      // Bottom border
      hRule(doc, MARGIN, y + rowH, CONTENT_W, COLORS.tableBorder, 0.3);
      y += rowH;
    });

    if (!order.items || order.items.length === 0) {
      filledRect(doc, MARGIN, y, CONTENT_W, rowH, COLORS.tableRowAlt);
      doc.fontSize(9).fillColor(COLORS.mutedText).text("No products found.", MARGIN + 10, y + 6);
      y += rowH;
    }

    // ═══════════════════════════════════════════════════════════
    // SUMMARY BLOCK  (right-aligned dark card)
    // ═══════════════════════════════════════════════════════════
    y += 20;
    const sumW = 195;
    const sumX = MARGIN + CONTENT_W - sumW;
    const lineH = 22;
    const sumLines = [
      { label: "Gross Amount",   value: `OMR ${Number(order.grossAmount   || 0).toFixed(3)}` },
      { label: "Total Discount", value: `OMR ${Number(order.totalDiscount || 0).toFixed(3)}` },
      { label: "Total FOC",      value: String(order.totalFOC             || 0) },
    ];
    const sumH = lineH * sumLines.length + 34;  // +34 for grand total row

    filledRect(doc, sumX, y, sumW, sumH, COLORS.summaryBg);
    filledRect(doc, sumX, y, 4, sumH, COLORS.accentStrong);

    let sy = y + 10;
    sumLines.forEach(({ label, value }) => {
      doc.fontSize(8).fillColor(COLORS.mutedText).font("Helvetica")
        .text(label, sumX + 12, sy);
      doc.fontSize(9).fillColor(COLORS.white).font("Helvetica-Bold")
        .text(value, sumX + 12, sy, { width: sumW - 20, align: "right" });
      sy += lineH;
    });

    // Grand total row
    filledRect(doc, sumX, sy, sumW, 28, COLORS.accentStrong);
    doc.fontSize(9).fillColor(COLORS.headerBg).font("Helvetica-Bold")
      .text("GRAND TOTAL", sumX + 12, sy + 8);
    doc.fontSize(11).fillColor(COLORS.headerBg).font("Helvetica-Bold")
      .text(`OMR ${Number(order.grandTotal || 0).toFixed(3)}`, sumX + 12, sy + 7, { width: sumW - 20, align: "right" });

    // ═══════════════════════════════════════════════════════════
    // REMARKS
    // ═══════════════════════════════════════════════════════════
    const remY = y;
    doc
      .fontSize(9)
      .fillColor(COLORS.mutedText)
      .font("Helvetica-Bold")
      .text("REMARKS", MARGIN, remY);

    const remBoxH = 44;
    filledRect(doc, MARGIN, remY + 14, sumX - MARGIN - 12, remBoxH, "#f8fafc");
    filledRect(doc, MARGIN, remY + 14, 3, remBoxH, COLORS.accentStrong);

    doc.fontSize(9).fillColor(COLORS.bodyText).font("Helvetica")
      .text(order.remarks || "No remarks provided.", MARGIN + 10, remY + 22, {
        width: sumX - MARGIN - 22,
        height: remBoxH - 12,
        ellipsis: true,
      });

    // ═══════════════════════════════════════════════════════════
    // SIGNATURES
    // ═══════════════════════════════════════════════════════════
    const sigY = Math.max(y + sumH, remY + 14 + remBoxH) + 28;

    hRule(doc, MARGIN, sigY, CONTENT_W, COLORS.divider, 0.5);

    const sigLabels = ["Prepared By", "Approved By", "Customer Signature"];
    const sigW = CONTENT_W / 3;

    sigLabels.forEach((label, i) => {
      const sx = MARGIN + i * sigW;
      hRule(doc, sx + 10, sigY + 30, sigW - 24, COLORS.accentStrong, 1);
      doc.fontSize(8).fillColor(COLORS.mutedText).font("Helvetica")
        .text(label, sx, sigY + 36, { width: sigW - 4, align: "center" });
    });

    // ═══════════════════════════════════════════════════════════
    // FOOTER BAND
    // ═══════════════════════════════════════════════════════════
    filledRect(doc, 0, 810, PAGE_W, 32, COLORS.footerBg);
    filledRect(doc, 0, 810, PAGE_W, 2, COLORS.accentStrong);

    doc
      .fontSize(7.5)
      .fillColor(COLORS.footerText)
      .font("Helvetica")
      .text(
        `Generated on ${new Date().toLocaleString()}   ·   Sales Order Management System   ·   Developed by Samar Ahmed`,
        MARGIN,
        819,
        { width: CONTENT_W, align: "center" }
      );

    doc.end();
  });
};

module.exports = generatePDFBuffer;
