const nodemailer = require("nodemailer");

const sendOrderEmail = async (
  order,
  pdfPath
) => {
  try {
    console.log(
  "sendOrderEmail called"
);

console.log(
  "OWNER_EMAIL:",
  process.env.OWNER_EMAIL
);

console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER
);

console.log(
  "PDF Path:",
  pdfPath
);

console.log(
  "EMAIL_PASS exists:",
  !!process.env.EMAIL_PASS
);
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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

    <p><strong>Delivery Date:</strong> ${new Date(
      order.deliveryDate
    ).toDateString()}</p>

    <p><strong>Grand Total:</strong> OMR ${order.grandTotal}</p>

    <p>Please find the attached PDF.</p>
  `,

  //attachments: [
    //{
      //filename: `${order.bookingNumber}.pdf`,
      //path: pdfPath,
    //},
  //],
};

    await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent");
  } catch (error) {
    console.log("Email Error:", error);
  }
};

module.exports = sendOrderEmail;