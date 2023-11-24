const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('../config');
module.exports = {
  ...
  registerUser: async (email, password, passwordConfirmation) => {
    if (!this.validateEmail(email)) {
      throw new ApiError('Invalid email format', status.BAD_REQUEST);
    }
    const userExists = await sequelizeUtils.checkIfExists('users', { email });
    if (userExists) {
      throw new ApiError('Email already registered', status.BAD_REQUEST);
    }
    if (!this.validatePassword(password, passwordConfirmation)) {
      throw new ApiError('Invalid password or password confirmation', status.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await sequelizeUtils.create('users', { email, password: hashedPassword });
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });
    const transporter = nodemailer.createTransport(config.email);
    const mailOptions = {
      from: 'no-reply@example.com',
      to: email,
      subject: 'Email Confirmation',
      text: `Please confirm your email by clicking on the following link: \nhttp://${config.host}/confirm/${token}\n`
    };
    await transporter.sendMail(mailOptions);
    return { id: user.id, email: user.email, confirmed: false };
  },
  confirmEmail: async (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (e) {
      throw new ApiError('Invalid or expired confirmation token', status.BAD_REQUEST);
    }
    const user = await sequelizeUtils.update('users', { id: decoded.userId }, { confirmed: true });
    return { id: user.id, email: user.email, confirmed: true };
  },
  ...
}
