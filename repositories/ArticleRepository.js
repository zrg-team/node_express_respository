const BaseRepository = require('./BaseRepository')
const ApiError = require('../utils/ApiError')
const SequelizeUtils = require('../utils/SequelizeUtils')
const repositoryHelper = require('../utils/repositoryHelper')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('Article')
  }
  async getArticleById(id) {
    const article = await this.findById(id)
    if (!article) {
      return null
    }
    return article
  }
  async getArticleDetails(id) {
    const article = await this.findById(id)
    if (!article) {
      throw new ApiError('Article not found')
    }
    const { title, description, created_at } = SequelizeUtils.getFields(article, ['title', 'description', 'created_at'])
    return {
      title: repositoryHelper.trimLongText(title),
      description: repositoryHelper.trimLongText(description),
      created_at
    }
  }
  async getArticles(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const articles = await this.model.findAndCountAll({
      attributes: ['title', 'description', 'created_at'],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    articles.rows = articles.rows.map(article => {
      return {
        title: repositoryHelper.trimLongText(article.title),
        description: repositoryHelper.trimLongText(article.description),
        created_at: article.created_at
      }
    });
    return {
      totalItems: articles.count,
      totalPages: Math.ceil(articles.count / limit),
      data: articles.rows
    };
  }
}
module.exports = new ArticleRepository()
