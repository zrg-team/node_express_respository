const BaseRepository = require('./BaseRepository')
class UserTypeRepository extends BaseRepository {
  constructor () {
    super('user_types')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
}
module.exports = new UserTypeRepository()
