// PATH: /routes/user.js
const auth = require('.././libs/auth')
const file = require('.././libs/files')
const MODULE_NAME = 'user'
const routes = {
  'POST /': {
    path: 'UserController.create',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'GET /me': {
    path: 'UserController.me',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'GET /': {
    path: 'UserController.find',
    middlewares: [
      auth.service.public(),
      file.all.none()
    ]
  },
  'POST /login': {
    path: 'UserController.login',
    middlewares: [
      file.all.none()
    ]
  },
  'POST /verify': {
    path: 'UserController.verify',
    middlewares: [
      file.all.none()
    ]
  },
  'POST /forgot': {
    path: 'UserController.forgotPassword',
    middlewares: [
      file.all.none()
    ]
  },
  'POST /password': {
    path: 'UserController.changePassword',
    middlewares: [
      file.all.none()
    ]
  },
  'GET /version': {
    path: 'UserController.version',
    middlewares: [
      file.all.none()
    ]
  },
  'GET /api/articles/:id': {
    path: 'ArticleController.getArticleDetails',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'GET /api/articles': {
    path: 'ArticleController.getArticles',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  }
}
module.exports = {
  routes,
  MODULE_NAME
}
