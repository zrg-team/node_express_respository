const { Op, col, fn } = require('sequelize')

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
module.exports = {
  sequelizeOP,
  sequelizeFunctions
}
