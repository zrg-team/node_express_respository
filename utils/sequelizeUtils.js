const { Op, col, fn } = require('sequelize')
const sequelizeOP = {
  notIn: Op.notIn,
  gt: Op.gt,
  lte: Op.lte,
  gte: Op.gte
}
const sequelizeFunctions = {
  count: (field) => fn('COUNT', col(`${field}`)),
  sum: (field) => fn('SUM', col(`${field}`)),
  findOne: async (model, condition) => {
    try {
      return await model.findOne({ where: condition });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
}
module.exports = {
  sequelizeOP,
  sequelizeFunctions
}
