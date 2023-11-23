const Sequelize = require('sequelize')
const dbService = require('.././libs/db')
// Models
const User = require('../models/user')
const UserType = require('../models/user_type')
const File = require('../models/file')
const Article = require('../models/article')
class RepositoryHelper {
  constructor (sequelize) {
    this.factory = {}
    this.sequelize = sequelize
    this.models = {
      User: 'User',
      UserType: 'UserType',
      File: 'File',
      Article: 'Article'
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
      case this.models.Article:
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
      case 'article':
        this.factory.Article = this.getModel('Article')
        this.factory.Article.associate(this.factory)
        return this.factory.Article
    }
  }
  calculateTotalPages(total, limit) {
    return Math.ceil(total / limit);
  }
}
module.exports = new RepositoryHelper(dbService.database)
