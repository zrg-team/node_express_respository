const { Article } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
class ArticleRepository {
  constructor() {
    this.DEFAULT_LIMIT = 10;
    this.DEFAULT_SORT = [['created_at', 'DESC']];
    this.DEFAULT_PAGE = 0;
  }
  async getArticles(userId, page = this.DEFAULT_PAGE) {
    const offset = page * this.DEFAULT_LIMIT;
    const articles = await Article.findAll({
      where: { user_id: userId },
      order: this.DEFAULT_SORT,
      limit: this.DEFAULT_LIMIT,
      offset: offset,
      attributes: ['title', 'description', 'created_at'],
    });
    // Trim title and description to 2 lines
    articles.forEach(article => {
      article.title = this.trimToTwoLines(article.title);
      article.description = this.trimToTwoLines(article.description);
    });
    const totalItems = await Article.count({ where: { user_id: userId } });
    const totalPages = Math.ceil(totalItems / this.DEFAULT_LIMIT);
    return { articles, totalItems, totalPages };
  }
  trimToTwoLines(text) {
    const lines = text.split('\n');
    if (lines.length > 2) {
      return lines.slice(0, 2).join('\n') + '...';
    }
    return text;
  }
}
module.exports = new ArticleRepository();
