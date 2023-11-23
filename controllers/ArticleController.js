// PATH: /controllers/ArticleController.js
const ApiError = require('../utils/api-error')
const articleRepository = require('../repositories/ArticleRepository')
const validateId = require('../utils/validateId')
const ArticleController = () => {
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      // Validate id
      if (!validateId(id)) {
        return next(new ApiError('Invalid ID', 400));
      }
      // Find article by id
      const article = await articleRepository.findById(id);
      // If article not found, return error
      if (!article) {
        return next(new ApiError('Article not found', 404));
      }
      // Return article details
      return res.json({
        title: article.title,
        description: article.description,
        created_at: article.created_at
      });
    } catch (err) {
      return next(err);
    }
  };
  return {
    getArticleDetails,
    // other methods...
  };
};
module.exports = ArticleController;
