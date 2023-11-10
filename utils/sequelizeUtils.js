const { Op, col, fn, Model, Sequelize } = require('sequelize')
const sequelizeOP = {
  notIn: Op.notIn,
  gt: Op.gt,
  lte: Op.lte,
  gte: Op.gte
}
const sequelizeFunctions = {
  count: (field) => fn('COUNT', col(`${field}`)),
  sum: (field) => fn('SUM', col(`${field}`))
}
const getArticleList = async (userId, page) => {
  const model = Model.getModel('articles');
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const result = await model.findAndCountAll({
    where: {
      user_id: userId
    },
    order: [
      ['created_at', 'DESC']
    ],
    limit: pageSize,
    offset: offset
  });
  const articles = result.rows.map(article => {
    return {
      title: article.title.length > 100 ? `${article.title.substring(0, 100)}...` : article.title,
      description: article.description.length > 100 ? `${article.description.substring(0, 100)}...` : article.description,
      created_at: article.created_at
    }
  });
  const totalItems = result.count;
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    articles,
    totalItems,
    totalPages
  };
}
module.exports = {
  sequelizeOP,
  sequelizeFunctions,
  getArticleList
}
