
const Sequelize = require('sequelize')
const connection = require('../config')
const logger = require('../utils/logger')
const UserModel = require('../models/user')
const ArticleModel = require('../models/article')
const CommentModel = require('../models/comment')

const ENV = process.env.NODE_ENV || 'development'

const dbService = (environment) => {
  const acceptable = ['development', 'staging', 'testing', 'production']
  if (!acceptable.includes(environment)) {
    throw new Error(`[Database] Wrong environment specified: ${environment}. Only eccept ${acceptable}.`)
  }
  const database = new Sequelize(
    connection.database.database,
    connection.database.username,
    connection.database.password, {
      host: connection.database.host,
      dialect: connection.database.dialect,
      define: connection.database.define,
      logging: connection.database.log ? msg => logger.silly(msg) : false
    }
  )
  
  // Load models
  const User = UserModel(database, Sequelize)
  const Article = ArticleModel(database, Sequelize)
  const Comment = CommentModel(database, Sequelize)

  // Set up model associations
  User.hasMany(Article, { foreignKey: 'user_id' })
  Article.hasMany(Comment, { foreignKey: 'article_id' })

  const authenticate = async () => {
    await database.authenticate()
    logger.info(`[Database] Connected, host => ${connection.database.host}`)
  }
  const close = async () => {
    await database.close()
    logger.warn(`[Database] Disconnected, host => ${connection.database.host}`)
  }
  const sync = async () => {
    logger.debug('[Database] Synchronization start')
    await database.sync()
    // Associate models
    User.associate(database.models)
    Article.associate(database.models)
    logger.info('[Database] Synchronization completed')
  }

  const services = {
    authenticate,
    sync,
    close,
    database
  }
  
  // Export models
  return {
    ...services, User, Article, Comment
  }
}

module.exports = dbService(ENV)
