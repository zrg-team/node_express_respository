const BaseRepository = require('./BaseRepository')

class UserRepository extends BaseRepository {
  constructor () {
    super('user')

    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
}

module.exports = new UserRepository()
