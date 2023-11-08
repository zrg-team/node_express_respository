// PATH: /utils/sequelizeUtils.js
const { Op, col, fn } = require('sequelize');
const sequelizeOP = {
  notIn: Op.notIn,
  gt: Op.gt,
  lte: Op.lte,
  gte: Op.gte,
  like: Op.like,
  in: Op.in
};
const sequelizeFunctions = {
  count: (field) => fn('COUNT', col(`${field}`)),
  sum: (field) => fn('SUM', col(`${field}`)),
  max: (field) => fn('MAX', col(`${field}`)),
  min: (field) => fn('MIN', col(`${field}`)),
  avg: (field) => fn('AVG', col(`${field}`))
};
const sequelizeUtils = {
  calculatePagination: (currentPage, perPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / perPage);
    return {
      previousPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      totalPages: totalPages,
      currentPage: currentPage,
      perPage: perPage
    };
  }
};
module.exports = {
  sequelizeOP,
  sequelizeFunctions,
  sequelizeUtils
};
