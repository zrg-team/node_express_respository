const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const ApiError = require('../errors/ApiError');
const status = require('http-status');
async function updateUserProfile(id, name, email, password) {
  // ... existing code ...
}
async function registerUser(name, email, password) {
  if (!name) {
    throw new ApiError('The name is required.', status.BAD_REQUEST);
  }
  if (!email) {
    throw new ApiError('The email is required.', status.BAD_REQUEST);
  }
  if (!password) {
    throw new ApiError('The password is required.', status.BAD_REQUEST);
  }
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    throw new ApiError('The email is not in valid format.', status.BAD_REQUEST);
  }
  if (password.length < 8) {
    throw new ApiError('The password must be at least 8 characters.', status.BAD_REQUEST);
  }
  const emailExists = await User.findOne({ where: { email: email } });
  if (emailExists) {
    throw new ApiError('Email is already registered', status.BAD_REQUEST);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name, email: email, password: hashedPassword, created_at: new Date(), updated_at: new Date() });
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Confirm your email',
    text: 'Click on the link to confirm your email: http://your-website.com/confirm-email?email=' + email
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  return { id: user.id, name: name, email: email, created_at: user.created_at };
}
module.exports = {
  updateUserProfile,
  registerUser
}
