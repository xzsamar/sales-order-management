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
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

    console.log("Verifying SMTP...");

    

    console.log("SMTP verified!");

    const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.OWNER_EMAIL,
  subject: "Test Email",
  text: "Hello from Render",
};
    console.log("Sending email...");

    const info = await Promise.race([
  transporter.sendMail(mailOptions),
  new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("SendMail Timeout")),
      15000
    )
  ),
]);

console.log("Email sent:", info.messageId);

    
    

    
  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error
    );
  }
};

module.exports = sendOrderEmail;