const BaseRepository = require('./BaseRepository');
const { order } = require('../utils/sequelizeUtils');
class ArticleRepository extends BaseRepository {
  constructor({ Article }) {
    super(Article);
  }
  async getArticles(page) {
    const limit = 10;
    const offset = (page - 1) * limit;
    const articles = await this.findAll({
      attributes: ['title', 'description', 'created_at'],
      limit,
      offset,
      order: [order('created_at', 'DESC')],
    });
    // Trim title and description if they are too long
    articles.forEach(article => {
      if (article.title.length > 100) {
        article.title = article.title.substring(0, 97) + '...';
      }
      if (article.description.length > 200) {
        article.description = article.description.substring(0, 197) + '...';
      }
    });
    const total = await this.count();
    const totalPages = Math.ceil(total / limit);
    return { articles, totalPages };
  }
}
module.exports = ArticleRepository;
