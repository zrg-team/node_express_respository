const { Op, col, fn } = require('sequelize')
const UserArticle = require('../models/UserArticle')
const User = require('../models/User')
const Article = require('../models/Article')
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
const validateUserAndArticle = async (userId, articleId) => {
  try {
    const user = await User.findByPk(userId)
    const article = await Article.findByPk(articleId)
    if (!user || !article) {
      return false
    }
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const createRecord = async (userId, articleId) => {
  try {
    const isValid = await validateUserAndArticle(userId, articleId)
    if (!isValid) {
      return null
    }
    const record = await UserArticle.create({
      user_id: userId,
      article_id: articleId,
      read_at: new Date()
    })
    return record
  } catch (error) {
    console.error(error)
    return null
  }
}
module.exports = {
  sequelizeOP,
  sequelizeFunctions,
  createRecord
}
