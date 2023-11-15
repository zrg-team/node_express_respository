const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
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
      const page = req.query.page || 1;
      const { data, total, pages } = await rawRepository.getArticles(page);
      data.forEach(article => {
        if (article.title.length > 50) {
          article.title = article.title.substring(0, 47) + '...';
        }
        if (article.description.length > 100) {
          article.description = article.description.substring(0, 97) + '...';
        }
      });
      return response(res)
        .success({
          data,
          total,
          pages
        })
    } catch (err) {
      next(err)
    }
  }
  return {
    version,
    highlightUser,
    getArticles
  }
}
module.exports = DashboardController
