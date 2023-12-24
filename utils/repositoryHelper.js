const Sequelize = require('sequelize')
const dbService = require('.././libs/db')
// Models
const User = require('../models/user')
const UserType = require('../models/user_type')
const File = require('../models/file')
const Post = require('../models/post')

class RepositoryHelper {
  constructor (sequelize) {
    this.factory = {}
    this.sequelize = sequelize
    this.models = {
      User: 'User',
      UserType: 'UserType',
      File: 'File',
      Post: 'Post'
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
      case this.models.Post:
        model = Post(this.sequelize, Sequelize)
        this.factory.Post = model
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
      case 'post':
        this.factory.Post = this.getModel('Post')
        this.factory.User = this.getModel('User')
        this.factory.Post.associate(this.factory)
        return this.factory.Post
    }
  }
}

// Comment

module.exports = new RepositoryHelper(dbService.database)
