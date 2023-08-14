const mailer = require("nodemailer");

async function sendMail(address, type, content, subject) {
  let emailHtml;

  const verify = `<p> click on the verification link to confirm your account </p> 
<a href="https://google.com">${content}</a>`;
  const reset = `<p> click on the link below to reset your paswword </p> 
<a href="https://google.com">${content}</a>`;

  type === "verify" ? (emailHtml = verify) : (emailHtml = reset);

  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: "micheal.badmus@gmail.com",
      pass: process.env.MAIL_PASS,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: "Admin TuutorApp ",
      to: `${address}`,
      html: emailHtml,
      subject,
    });
    return { accepted: info.accepted, rejected: info.rejected };
  } catch (err) {
    return err;
  }
}
module.exports = { sendMail };
