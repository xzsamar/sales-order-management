const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendOrderEmail = async (
  order,
  pdfPath
) => {
  try {
    const response =
      await resend.emails.send({
        from: "onboarding@resend.dev",

        to: process.env.OWNER_EMAIL,

        subject: `New Sales Order - ${order.bookingNumber}`,

        html: `
          <h2>Sales Order Created</h2>

          <p><strong>Order Number:</strong> ${order.bookingNumber}</p>

          <p><strong>Customer:</strong>
          ${order.customer.customerName}</p>

          <p><strong>Sales Person:</strong>
          ${order.salesPerson}</p>

          <p><strong>Grand Total:</strong>
          OMR ${order.grandTotal}</p>
        `,
      });

    console.log(
      "✅ Email sent:",
      response
    );
  } catch (error) {
    console.error(
      "❌ Email Error:",
      error
    );
  }
};

module.exports = sendOrderEmail;