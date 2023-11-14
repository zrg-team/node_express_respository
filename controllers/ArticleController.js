// PATH: /controllers/ArticleController.js
const ArticleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await ArticleRepository.get(offset, limit, { order: [['created_at', 'DESC']] });
      const articles = rows.map(article => {
        return {
          title: article.title.length > 100 ? `${article.title.substring(0, 100)}...` : article.title,
          description: article.description.length > 200 ? `${article.description.substring(0, 200)}...` : article.description,
          created_at: article.created_at
        }
      });
      const totalPages = Math.ceil(count / limit);
      return response(res)
        .success({
          articles,
          totalArticles: count,
          totalPages
        })
    } catch (err) {
      next(err)
    }
  }
  return {
    getArticles
  }
}
module.exports = ArticleController
