const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // 465 if secure || 587 if not
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const opts = {
    from: "S-Shop <mohamedmowafyksa@gmail.com>",
    to: options.email,
    subject: options.subject,
    html: options.content,
  };

  await transporter.sendMail(opts);
};

module.exports = sendEmail;
