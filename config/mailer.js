require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
 
  // host: "smtp.gmail.com",
  // port: 465, // استخدم 587 مع `secure: false`
  // secure: true,
 service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendEmailWithLink = async (to, subject, linkText, linkUrl) => {
    try {
      const mailOptions = {
        from: `"Support Team" <${process.env.EMAIL_USER}>`, 
        replyTo: process.env.EMAIL_USER,
        to,
        subject,
        html: `
          <h2>${subject}</h2>
          <p>click on the next bottom to continue</p>
          <a href="${linkUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">
            ${linkText}
          </a>
          <p>if the bottom doesn't work you can copy this link and go to it in the browser</p>
          <p>${linkUrl}</p>
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("✅the email sent successfully:",to ,info.messageId);
      return { success: true, message: "Email sent successfully" };
    } catch (error) {
      console.error("❌ failed sending email", error);
      return { success: false, error: "Failed to send email" };
    }
  };

module.exports = {sendEmailWithLink};
