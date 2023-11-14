const { Article } = require('../models');
class ArticleRepository {
  // other methods...
  async get(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await Article.findAndCountAll({
      attributes: ['title', 'description', 'created_at'],
      order: [['created_at', 'DESC']],
      offset,
      limit,
    });
    const articles = result.rows.map(article => {
      return {
        ...article.dataValues,
        title: this.trimText(article.dataValues.title),
        description: this.trimText(article.dataValues.description),
      };
    });
    return {
      articles,
      total: result.count,
      totalPages: Math.ceil(result.count / limit),
    };
  }
  trimText(text, length = 50) {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  }
}
module.exports = ArticleRepository;
