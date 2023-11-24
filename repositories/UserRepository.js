const BaseRepository = require('./BaseRepository')
const User = require('../models/user')
const bcrypt = require('bcrypt')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async registerUser(email, password, passwordConfirmation) {
    if (password !== passwordConfirmation) {
      throw new Error('Password and password confirmation do not match');
    }
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      throw new Error('Email is already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email,
      password: hashedPassword,
      emailConfirmed: false
    });
    // TODO: Send confirmation email
    return {
      id: user.id,
      email: user.email,
      emailConfirmed: user.emailConfirmed
    };
  }
  async confirmEmail(email) {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new Error('User not found');
    }
    user.emailConfirmed = true;
    await user.save();
    return {
      id: user.id,
      email: user.email,
      emailConfirmed: user.emailConfirmed
    };
  }
}
module.exports = new UserRepository()
