const BaseRepository = require('./BaseRepository')
const User = require('../models/user')
const Shop = require('../models/shop')
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
  async checkEmailExists(email) {
    const user = await User.findOne({ where: { email } });
    return !!user;
  }
  async createUser(email, password) {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: encryptedPassword });
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
  async registerUser(email, password, passwordConfirmation) {
    if (password !== passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }
    if (await this.checkEmailExists(email)) {
      throw new ApiError('Email already exists', 400);
    }
    const user = await this.createUser(email, password);
    await this.sendConfirmationEmail(user);
    return user;
  }
  async sendConfirmationEmail(user) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
      }
    });
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Email Confirmation',
      text: `Please confirm your email by clicking on the following link: 
      http://your-website.com/confirm?userId=${user.id}`
    };
    await transporter.sendMail(mailOptions);
  }
  async updateShop(id, name, address, userId) {
    let updatedShop;
    try {
      await transaction(async () => {
        const shop = await Shop.findByPk(id);
        if (!shop) {
          throw new ApiError('Shop not found', 404);
        }
        if (shop.userId !== userId) {
          throw new ApiError('User does not have permission to update this shop', 403);
        }
        shop.name = name;
        shop.address = address;
        updatedShop = await shop.save();
      });
    } catch (error) {
      throw new ApiError('Update operation failed', 500);
    }
    return updatedShop;
  }
}
module.exports = new UserRepository()
