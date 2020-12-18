import nodemailer from 'nodemailer';
import config from './config.js';

exports.sendMail = async(sub, body, to) => {
  const smtpTrans = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.HOST_EMAIL, // generated ethereal user
      pass: config.HOST_EMAIL_PASSWORD // generated ethereal password
    }
  });

  const mailOptions = {
    to: to,
    from: config.HOST_EMAIL,
    subject: sub,
    html: body
  };
  await smtpTrans.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return err
    } else {
      console.log('Email sent : ' + info.response);
      return info.response;
    }
  })
}