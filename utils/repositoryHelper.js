const Sequelize = require('sequelize')
const dbService = require('.././libs/db')
const User = require('../models/user')
const UserType = require('../models/user_type')
const File = require('../models/file')
const Article = require('../models/article') // Import Article model
class RepositoryHelper {
  constructor (sequelize) {
    this.factory = {}
    this.sequelize = sequelize
    this.models = {
      User: 'User',
      UserType: 'UserType',
      File: 'File',
      Article: 'Article' // Add Article to models
    }
  }
  getRepositoryModel (repo) {
    return this.setupAssociations(repo)
  }
  getModel (name) {
    if (this.factory[name]) {
      return this.factory[name]
    }
    let model = null
    switch (name) {
      case this.models.User:
        model = User(this.sequelize, Sequelize)
        this.factory.User = model
        break
      case this.models.UserType:
        model = UserType(this.sequelize, Sequelize)
        this.factory.UserType = model
        break
      case this.models.File:
        model = File(this.sequelize, Sequelize)
        this.factory.File = model
        break
      case this.models.Article: // Add case for Article
        model = Article(this.sequelize, Sequelize)
        this.factory.Article = model
        break
    }
    return model
  }
  setupAssociations (repo) {
    switch (repo) {
      case 'user':
        this.factory.User = this.getModel('User')
        this.factory.UserType = this.getModel('UserType')
        this.factory.User.associate(this.factory)
        return this.factory.User
      case 'file':
        this.factory.File = this.getModel('File')
        this.factory.User = this.getModel('User')
        this.factory.File.associate(this.factory)
        return this.factory.File
      case 'article': // Add case for Article
        this.factory.Article = this.getModel('Article')
        this.factory.User = this.getModel('User')
        this.factory.Article.associate(this.factory)
        return this.factory.Article
    }
  }
}
module.exports = new RepositoryHelper(dbService.database)
