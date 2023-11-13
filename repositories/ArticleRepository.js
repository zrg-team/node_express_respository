const BaseRepository = require('./BaseRepository')
class ArticleRepository extends BaseRepository {
  constructor (model) {
    super(model)
  }
  async getArticleDetail (id) {
    if (!id) {
      throw new Error('Invalid article id')
    }
    const article = await this.model.findByPk(id)
    if (!article) {
      throw new Error('Article not found')
    }
    return article
  }
  get (filters, criteria) {
    filters = this.prepareGetFilters({
      ...criteria,
      ...filters,
      order: [['created_at', 'DESC']],
      limit: 10,
      offset: (filters.page - 1) * 10 || 0
    })
    return this.model.findAndCountAll(filters)
      .then(result => {
        return this.handlePaginate(result, filters)
      })
  }
  handlePaginate (result, filters) {
    return {
      total: result.count,
      limit: filters.limit,
      page: filters.page || 1,
      totalPage: Math.ceil(result.count / filters.limit),
      data: this.formatArticles(result.rows),
      count: result.rows.length
    }
  }
  handleResult (result) {
    if (result) {
      return {
        data: this.formatArticles(result),
        count: result.length
      }
    }
    return {
      data: [],
      count: 0
    }
  }
  formatArticles (articles) {
    return articles.map(article => ({
      ...article,
      title: this.trimToTwoLines(article.title),
      description: this.trimToTwoLines(article.description)
    }))
  }
  trimToTwoLines (text) {
    const lines = text.split('\n')
    return lines.length > 2 ? lines.slice(0, 2).join('\n') : text
  }
}
module.exports = ArticleRepository
