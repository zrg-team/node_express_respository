const BaseRepository = require('./BaseRepository')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('articles')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
}
module.exports = new ArticleRepository()
