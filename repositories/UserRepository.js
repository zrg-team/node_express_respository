const BaseRepository = require('./BaseRepository')
class UserRepository extends BaseRepository {
  constructor () {
    super('users') // specify the table name
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  // Add methods for interacting with the 'users' table here
  // For example, a method to find a user by username might look like this:
  /*
  findByUsername(username) {
    return this.model.findOne({ where: { username } })
  }
  */
}
module.exports = new UserRepository()
