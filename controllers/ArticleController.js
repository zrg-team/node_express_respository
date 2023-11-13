// PATH: /controllers/ArticleController.js
const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const ArticleController = () => {
  const getArticleDetail = async (req, res, next) => {
    try {
      const { user_id, article_id } = req.body;
      // Verify if the user is logged in
      const [user] = await rawRepository.select(`
        SELECT
          *
        FROM
          users
        WHERE
          id = ${user_id};
      `)
      if (!user) {
        return response(res)
          .error('User not logged in')
      }
      // Retrieve the article from the database
      const [article] = await rawRepository.select(`
        SELECT
          *
        FROM
          articles
        WHERE
          id = ${article_id};
      `)
      if (!article) {
        return response(res)
          .error('Article not found')
      }
      // Check if the user_id associated with the article matches the logged-in user's user_id
      if (article.user_id !== user_id) {
        return response(res)
          .error('User not authorized to view this article')
      }
      // Display the title, description, and created_at of the article
      return response(res)
        .success({
          title: article.title,
          description: article.description,
          created_at: article.created_at
        })
    } catch (err) {
      next(err)
    }
  }
  return {
    getArticleDetail
  }
}
module.exports = ArticleController
