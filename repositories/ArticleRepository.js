const BaseRepository = require('./BaseRepository')
const ApiError = require('../utils/api-error')
const { paginate } = require('../helpers/repositoryHelper')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
    this.DEFAULT_LIMIT = 10
    this.DEFAULT_SORT = [['created_at', 'DESC']]
    this.DEFAULT_PAGE = 1
  }
  async findById (id) {
    const article = await this.model.findOne({ where: { id } })
    if (!article) {
      throw new ApiError(`Article with id ${id} not found`, 404)
    }
    // Trim the title and description if they are too long
    if (article.title.length > 100) {
      article.title = article.title.substring(0, 97) + '...'
    }
    if (article.description.length > 200) {
      article.description = article.description.substring(0, 197) + '...'
    }
    return article
  }
  async getArticles(page = this.DEFAULT_PAGE) {
    const options = {
      order: this.DEFAULT_SORT,
      limit: this.DEFAULT_LIMIT,
      offset: (page - 1) * this.DEFAULT_LIMIT,
      attributes: ['title', 'description', 'created_at']
    }
    const articles = await this.model.findAll(options)
    articles.forEach(article => {
      if (article.title.length > 100) {
        article.title = article.title.substring(0, 97) + '...'
      }
      if (article.description.length > 100) {
        article.description = article.description.substring(0, 97) + '...'
      }
    })
    const totalItems = await this.model.count()
    const totalPages = Math.ceil(totalItems / this.DEFAULT_LIMIT)
    return {
      data: articles,
      meta: {
        totalItems,
        totalPages,
        currentPage: page
      }
    }
  }
}
module.exports = new ArticleRepository()
