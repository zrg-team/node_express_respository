const BaseRepository = require('./BaseRepository')

class PostRepository extends BaseRepository {
  constructor () {
    super('post')

    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
}

module.exports = new PostRepository()
