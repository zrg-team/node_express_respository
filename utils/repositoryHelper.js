
const Sequelize = require('sequelize')
const dbService = require('.././libs/db')
// Models
const User = require('../models/user')
const UserType = require('../models/user_type')
const Article = require('../models/article') // Added Article model
const File = require('../models/file')

class RepositoryHelper {
  constructor (sequelize) {
    this.factory = {}
    this.sequelize = sequelize
    this.models = {
      User: 'User',
      UserType: 'UserType',
      Article: 'Article', // Added Article to models
      File: 'File'
    }
  }

  getRepositoryModel (repo) {
    return this.setupAssociations(repo)
  }

  // Autoload mechanism for models
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
      case this.models.Article: // Added case for Article
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
      case 'article': // Added case for Article
        this.factory.Article = this.getModel('Article')
        this.factory.Article.associate(this.factory) // Assuming Article has an associate method
        return this.factory.Article
      case 'file':
        this.factory.File = this.getModel('File')
        this.factory.User = this.getModel('User')
        this.factory.File.associate(this.factory)
        return this.factory.File
      // Add other cases as needed for different repositories
    }
  }
}

module.exports = new RepositoryHelper(dbService.database)
