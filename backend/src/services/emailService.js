const nodemailer = require("nodemailer");

const sendOrderEmail = async (order, pdfPath) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("OWNER_EMAIL:", process.env.OWNER_EMAIL);
    console.log(
      "EMAIL_PASS length:",
      process.env.EMAIL_PASS?.length
    );

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // Force IPv4
});

    console.log("Verifying SMTP...");

    await transporter.verify();

    console.log("SMTP verified!");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: `New Sales Order - ${order.bookingNumber}`,

      html: `
        <h2>Sales Order Created</h2>
        <p><strong>Order Number:</strong> ${order.bookingNumber}</p>
        <p><strong>Customer:</strong> ${order.customer.customerName}</p>
        <p><strong>Sales Person:</strong> ${order.salesPerson}</p>
        <p><strong>Grand Total:</strong> OMR ${order.grandTotal}</p>
      `,

      attachments: pdfPath
        ? [
            {
              filename: `${order.bookingNumber}.pdf`,
              path: pdfPath,
            },
          ]
        : [],
    };

    console.log("Sending email...");

    const info = await transporter.sendMail(
      mailOptions
    );

    console.log(
      "Email sent:",
      info.messageId
    );
  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error
    );
  }
};

module.exports = sendOrderEmail;