const BaseRepository = require('./BaseRepository')
const db = require('../libs/db.js')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('articles')
    this.DEFAULT_LIMIT = 10
    this.DEFAULT_SORT = [['created_at', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  getArticles(page = this.DEFAULT_PAGE) {
    const offset = page * this.DEFAULT_LIMIT;
    return db.articles.findAndCountAll({
      order: this.DEFAULT_SORT,
      offset: offset,
      limit: this.DEFAULT_LIMIT
    }).then(result => {
      const totalArticles = result.count;
      const totalPages = Math.ceil(totalArticles / this.DEFAULT_LIMIT);
      const articles = result.rows.map(article => {
        article.title = article.title.length > 2 ? `${article.title.substring(0, 2)}...` : article.title;
        article.description = article.description.length > 2 ? `${article.description.substring(0, 2)}...` : article.description;
        return article;
      });
      return {
        articles,
        totalArticles,
        totalPages
      };
    });
  }
}
module.exports = new ArticleRepository()
