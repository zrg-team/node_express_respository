const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
async function updateUserProfile(id, name, email, password) {
  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    throw new ApiError('User does not exist', status.NOT_FOUND);
  }
  const emailExists = await User.findOne({ where: { email: email } });
  if (emailExists && emailExists.id !== id) {
    throw new ApiError('Email is already registered', status.BAD_REQUEST);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.update({ name: name, email: email, password: hashedPassword, updated_at: new Date() }, { where: { id: id } });
  if(user.email !== email){
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
  }
  return { id: id, name: name, email: email };
}
module.exports = {
  updateUserProfile,
  checkUserExistence
}
