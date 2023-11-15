const BaseRepository = require('./BaseRepository');
const { order } = require('../utils/sequelizeUtils');
const ApiError = require('../utils/api-error');
class ArticleRepository extends BaseRepository {
  constructor({ Article, UserArticle }) {
    super(Article);
    this.UserArticle = UserArticle;
  }
  async createUserArticle(user_id, article_id) {
    try {
      const read_at = new Date();
      const userArticle = await this.UserArticle.create({ user_id, article_id, read_at });
      return userArticle;
    } catch (error) {
      throw new ApiError(error);
    }
  }
  async findById(id) {
    if (isNaN(id)) {
      throw new Error('Wrong format.');
    }
    const article = await this.findOne({ where: { id } });
    if (!article) {
      throw new Error('This article is not found');
    }
    return article;
  }
  async getArticles(page, limit = 10) {
    if (typeof page !== 'number' || page < 1) {
      throw new Error('Page must be greater than 0.');
    }
    if (typeof limit !== 'number') {
      throw new Error('Wrong format.');
    }
    const offset = (page - 1) * limit;
    const articles = await this.findAll({
      attributes: ['id', 'title', 'description', 'created_at'],
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
    return { status: 200, articles, totalPages, limit, page };
  }
}
module.exports = ArticleRepository;
