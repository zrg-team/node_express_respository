// PATH: /controllers/DashboardController.js
const rawRepository = require('../repositories/RawRepository')
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const DashboardController = () => {
  const version = (req, res) => {
    return response(res)
      .success({ msg: '1.0.0' })
  }
  const highlightUser = async (req, res, next) => {
    try {
      const { 0: data } = await rawRepository.select(`
      SELECT
        *
      FROM
        USER
      LIMIT 1;
      `)
      return response(res)
        .success({
          ...data
        })
    } catch (err) {
      next(err)
    }
  }
  const getArticles = async (req, res, next) => {
    try {
      const page = req.params.page;
      if (!util.validatePageNumber(page)) {
        return response(res).error('Invalid page number');
      }
      const limit = 10;
      const offset = (page - 1) * limit;
      const articles = await articleRepository.getArticles(offset, limit);
      const formattedArticles = articles.map(util.formatArticleData);
      const totalArticles = await articleRepository.countArticles();
      const totalPages = util.calculateTotalPages(totalArticles, limit);
      return response(res).success({
        articles: formattedArticles,
        totalArticles,
        totalPages
      });
    } catch (err) {
      next(err);
    }
  }
  return {
    version,
    highlightUser,
    getArticles
  }
}
module.exports = DashboardController
