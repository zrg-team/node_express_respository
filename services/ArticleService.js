const { Op } = require("sequelize");
const models = require('../models');
class ArticleService {
  // Other functions...
  async fetchArticles(page = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;
    const articles = await models.Article.findAll({
      attributes: ['title', 'description', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: limit,
      offset: offset,
    });
    const trimmedArticles = articles.map(article => {
      return {
        ...article.dataValues,
        title: this.trimText(article.title),
        description: this.trimText(article.description)
      };
    });
    const totalItems = await models.Article.count();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      items: trimmedArticles,
      totalItems,
      totalPages
    };
  }
  trimText(text) {
    const maxLength = 100; // Maximum length for 2 lines of text
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}
module.exports = new ArticleService();
