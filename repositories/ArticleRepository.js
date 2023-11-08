const BaseRepository = require('./BaseRepository');
const Article = require('../models/Article');
class ArticleRepository extends BaseRepository {
  constructor() {
    super(Article);
  }
  async get(articleId) {
    return this.findById(articleId);
  }
}
module.exports = new ArticleRepository();
