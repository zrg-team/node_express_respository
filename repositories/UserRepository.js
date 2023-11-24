const BaseRepository = require('./BaseRepository')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { transaction } = require('../utils/transaction')
const ApiError = require('../utils/api-error')
const nodemailer = require('nodemailer')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async createUser(email, password, password_confirmation) {
    if (password !== password_confirmation) {
      throw new ApiError('Passwords do not match', 400);
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError('Email already registered', 400);
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: encryptedPassword, emailConfirmed: false });
    // Send confirmation email
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
      subject: 'Email Confirmation',
      text: 'Please confirm your email'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return user;
  }
  async confirmEmail(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    user.emailConfirmed = true;
    await user.save();
  }
  // Other functions...
}
module.exports = new UserRepository()
