const BaseRepository = require('./BaseRepository')
const { User } = require('../models')
const bcrypt = require('bcrypt');
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async getUser(username) {
    const user = await User.findOne({
      where: {
        username: username
      }
    });
    return user ? user : null;
  }
  async validateUser(username, password) {
    const user = await this.getUser(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}
module.exports = new UserRepository()
