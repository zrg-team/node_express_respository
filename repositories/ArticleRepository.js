const BaseRepository = require('./BaseRepository')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  findById(id) {
    return this.model.findOne({
      where: {
        id: id
      },
      attributes: ['title', 'description', 'created_at']
    }).then(article => {
      if (article) {
        article.title = this.trimText(article.title);
        article.description = this.trimText(article.description);
      }
      return article;
    });
  }
  trimText(text) {
    const MAX_LENGTH = 100;
    if (text.length > MAX_LENGTH) {
      return text.substring(0, MAX_LENGTH) + '...';
    }
    return text;
  }
}
module.exports = new ArticleRepository()
