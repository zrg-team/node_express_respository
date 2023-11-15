const factory = require('../utils/repositoryHelper')
class BaseRepository {
  constructor (model) {
    if (model) {
      this.model = factory.getRepositoryModel(model)
    }
  }
  getArticles(page = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;
    return this.model.findAll({
      attributes: ['title', 'description', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: limit,
      offset: offset
    })
    .then(articles => {
      return articles.map(article => {
        article.title = this.trimText(article.title);
        article.description = this.trimText(article.description);
        return article;
      });
    })
    .then(articles => {
      return this.model.count()
        .then(count => {
          return {
            articles: articles,
            totalItems: count,
            totalPages: Math.ceil(count / limit)
          };
        });
    });
  }
  trimText(text) {
    const maxLength = 100; // Maximum length for 2 lines
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}
module.exports = BaseRepository
