const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const UserController = () => {
  // ... other functions
  const getArticles = async (req, res, next) => {
    try {
      const { user_id, page = 1 } = req.query
      const limit = 10
      const offset = (page - 1) * limit
      const articles = await articleRepository
        .findAll({
          where: {
            user_id: user_id
          },
          order: [
            ['created_at', 'DESC']
          ],
          limit: limit,
          offset: offset
        })
      const totalItems = await articleRepository.count({ where: { user_id: user_id } });
      const totalPages = Math.ceil(totalItems / limit);
      const articlesData = articles.map(article => {
        return {
          title: article.title.length > 100 ? `${article.title.substring(0, 100)}...` : article.title,
          description: article.description.length > 100 ? `${article.description.substring(0, 100)}...` : article.description,
          created_at: article.created_at
        }
      })
      return response(res).success({ data: articlesData, totalItems, totalPages })
    } catch (err) {
      return next(err)
    }
  }
  return {
    // ... other functions
    getArticles
  }
}
module.exports = UserController
