const fs = require('fs');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const config = require('../config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.email.name,
    pass: config.email.secret,
  },
});

function sendMail(type, data = {}, mailOptions = {}) {
  try {
    const source = fs.readFileSync(`../emails/${type}.email`, 'utf8');
    const template = handlebars.compile(source);
    const html = template(data);
    const ignoreError = !!mailOptions.ignoreError;
    delete mailOptions.ignoreError;
    return new Promise((resolve, reject) => transporter.sendMail({
      from: config.email.name,
      html,
      ...mailOptions,
    }, function (err, info) {
      if (err) {
        if (ignoreError) {
          return resolve(false);
        }
        return reject(err);
      }
      resolve(info);
    }));
  } catch (err) {
    return false;
  }
}

function sendRegistrationConfirmation(email, token) {
  const mailOptions = {
    to: email,
    subject: 'Confirm your registration',
    html: `<p>Please confirm your registration by clicking on the link below:</p>
           <a href="http://example.com/confirm?token=${token}">Confirm Registration</a>`,
  };

  return sendMail('registration_confirmation', {}, mailOptions);
}

// New sendEmail function integrated with existing sendMail function
function sendEmail(to, subject, body) {
  const mailOptions = {
    to,
    subject,
    html: body,
  };

  return sendMail('custom_email', {}, mailOptions);
}

module.exports = {
  sendMail,
  sendRegistrationConfirmation,
  sendEmail,
};
