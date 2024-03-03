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
  'GET /articles': {
    path: 'UserController.getArticles',
    middlewares: [
      auth.service.public(), // Assuming the articles list is publicly accessible
      file.all.none()
    ]
  },
  'POST /login': {
    path: 'UserController.login',
    middlewares: [
      file.all.none()
    ]
  },
  'PUT /api/articles/:id': {
    path: 'DashboardController.updateArticleDetails',
    middlewares: [
      auth.service.all(),
      auth.service.checkRole(['writer', 'admin']), // Assuming 'writer' and 'admin' are valid roles for updating articles
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
  }
}

module.exports = {
  routes,
  MODULE_NAME
}
