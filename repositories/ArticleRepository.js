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
}
module.exports = new ArticleRepository()
