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
  async validateEmail(email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError('Email already registered', 400);
    }
    return true;
  }
  async validatePassword(password, password_confirmation) {
    if (password !== password_confirmation) {
      throw new ApiError('Passwords do not match', 400);
    }
    // Add more security requirements if needed
    return true;
  }
  async createUser(email, password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: encryptedPassword, emailConfirmed: false });
    return user;
  }
  async confirmEmail(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    user.emailConfirmed = true;
    await user.save();
  }
  async registerUser(email, password, password_confirmation) {
    await this.validateEmail(email);
    await this.validatePassword(password, password_confirmation);
    const user = await this.createUser(email, password);
    // Send confirmation email
    // This is a placeholder, replace with your actual email sending code
    nodemailer.sendMail({
      from: 'no-reply@yourdomain.com',
      to: email,
      subject: 'Please confirm your email',
      text: 'Please confirm your email'
    });
    return user;
  }
}
module.exports = new UserRepository()
