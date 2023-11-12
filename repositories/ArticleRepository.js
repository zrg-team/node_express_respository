const BaseRepository = require('./BaseRepository');
const SequelizeUtils = require('../utils/SequelizeUtils');
class ArticleRepository extends BaseRepository {
  constructor () {
    super('articles') // assuming 'articles' is the name of the table
  }
  async getArticleById(id) {
    const article = await this.model.findByPk(id);
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }
  async deleteArticle(articleId) {
    try {
        const article = await SequelizeUtils.findOne('articles', { id: articleId });
        if (!article) {
            throw new Error('Article not found');
        }
        await SequelizeUtils.delete('articles', { id: articleId });
        return 'Article has been deleted successfully';
    } catch (error) {
        throw error;
    }
  }
}
module.exports = new ArticleRepository();
