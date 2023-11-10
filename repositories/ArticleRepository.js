const BaseRepository = require('./BaseRepository')
const RepositoryHelper = require('../utils/repositoryHelper')
const { Op } = require("sequelize");
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
  }
  async getArticle(user_id, page = 1) {
    if (typeof user_id !== 'number' || typeof page !== 'number') {
      throw new Error('Wrong format.')
    }
    const Article = RepositoryHelper.getModel('article')
    const limit = 10;
    const offset = (page - 1) * limit;
    const articles = await Article.findAll({ 
      where: { user_id: user_id },
      order: [['created_at', 'DESC']],
      limit: limit,
      offset: offset
    })
    if (!articles) {
      throw new Error('This article is not found')
    }
    const totalItems = await Article.count({ where: { user_id: user_id } });
    const totalPages = Math.ceil(totalItems / limit);
    return {
      articles: articles.map(article => ({
        title: article.title.length > 50 ? `${article.title.substring(0, 50)}...` : article.title,
        description: article.description.length > 100 ? `${article.description.substring(0, 100)}...` : article.description,
        created_at: article.created_at
      })),
      totalItems,
      totalPages
    }
  }
  async getArticleDetail(user_id, article_id) {
    if (typeof user_id !== 'number' || typeof article_id !== 'number') {
      throw new Error('Wrong format.')
    }
    const Article = RepositoryHelper.getModel('article')
    const article = await Article.findOne({ 
      where: { id: article_id, user_id: user_id }, 
      attributes: ['title', 'description', 'created_at'] 
    })
    if (!article) {
      throw new Error('This article is not found or you are not authorized to view it')
    }
    return article
  }
}
module.exports = new ArticleRepository()
