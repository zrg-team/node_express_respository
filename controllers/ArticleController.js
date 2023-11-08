// PATH: /controllers/ArticleController.js
const UserRepository = require('../repositories/UserRepository');
const ArticleRepository = require('../repositories/ArticleRepository');
const sequelizeUtils = require('../utils/sequelizeUtils');
const response = require('../utils/response');
const ArticleController = () => {
  const getArticleList = async (req, res, next) => {
    try {
      const userId = req.params.user_id;
      const validUser = await UserRepository.validateUser(userId);
      if (!validUser) {
        return response(res).error('Invalid user ID', 400);
      }
      const currentPage = parseInt(req.query.current_page) || UserRepository.defaultCurrentPage;
      const perPage = parseInt(req.query.per_page) || UserRepository.defaultPerPage;
      const offset = (currentPage - 1) * perPage;
      const articles = await ArticleRepository.getArticlesByUserId(userId, offset, perPage, true); // Added 'true' to indicate ordering by 'created_at' DESC
      const totalArticles = await sequelizeUtils.sequelizeFunctions.count('articles', { where: { user_id: userId } });
      const trimmedArticles = articles.map(article => ({
        ...article,
        title: sequelizeUtils.trimText(article.title, 2), // Updated to use a utility function for trimming
        description: sequelizeUtils.trimText(article.description, 2) // Updated to use a utility function for trimming
      }));
      const totalPages = Math.ceil(totalArticles / perPage);
      const pagination = {
        current_page: currentPage,
        per_page: perPage,
        total_pages: totalPages,
        has_pagination: totalPages > 1 // Updated condition based on requirement
      };
      return response(res).success({
        articles: trimmedArticles,
        total_items: totalArticles, // Added total_items to the response
        pagination
      });
    } catch (err) {
      next(err);
    }
  };
  return {
    getArticleList
  };
};
module.exports = ArticleController;
