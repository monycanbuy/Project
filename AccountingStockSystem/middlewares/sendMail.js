// const nodemailer = require('nodemailer');

// const transport = nodemailer.createTransport({
// 	service: 'gmail',
// 	auth: {
// 		user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
// 		pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
// 	},
// });

// module.exports = transport;

// const nodemailer = require("nodemailer");

// const transport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
//     pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
//   },
// });

// exports.sendEmail = async (to, subject, text) => {
//   const mailOptions = {
//     from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
//     to,
//     subject,
//     text,
//   };

//   try {
//     const info = await transport.sendMail(mailOptions);
//     console.log("Message sent: %s", info.messageId);
//     return info; // Ensure the function returns the info object
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
    pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
  },
});

exports.sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
    to,
    subject,
    text, // Plain text version for clients that don't support HTML
    html, // HTML version for rich rendering
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
