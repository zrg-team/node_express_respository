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
  // Existing routes from the existing code
  'POST /articles': {
    path: 'UserController.createArticle',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'PUT /articles/:id': {
    path: 'DashboardController.editArticle',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'PUT /articles/:id/status': {
    path: 'DashboardController.updateArticleStatus',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'GET /user/:userId/articles': {
    path: 'DashboardController.retrieveUserArticles',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  // New route from the new code
  'DELETE /article/:id': {
    path: 'UserController.removeArticle',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
}

module.exports = {
  routes,
  MODULE_NAME
}
