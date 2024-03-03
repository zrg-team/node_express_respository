const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(process.env.EMAIL_TRANSPORT_CONFIG);
