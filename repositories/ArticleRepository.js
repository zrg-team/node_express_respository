const BaseRepository = require('./BaseRepository');
const Article = require('../models/Article');
class ArticleRepository extends BaseRepository {
  constructor() {
    super(Article);
  }
  async get(articleId) {
    return this.findById(articleId);
  }
  async getArticlesByUser(user_id, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const articles = await this.model.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'title', 'description', 'created_at', 'updated_at'],
    });
    const totalItems = await this.model.count({ where: { user_id } });
    const totalPages = Math.ceil(totalItems / limit);
    return { 
      articles: articles.map(article => ({
        ...article.dataValues,
        title: this.trimText(article.dataValues.title, 50),
        description: this.trimText(article.dataValues.description, 100),
      })), 
      totalItems, 
      totalPages 
    };
  }
  trimText(text, maxLength) {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }
}
module.exports = new ArticleRepository();
