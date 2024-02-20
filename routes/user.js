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
  // New route from the new code
  'POST /api/articles': {
    path: 'DashboardController.createArticle',
    middlewares: [
      auth.service.all(),
      auth.service.writerOnly(),
      file.all.none()
    ]
  },
  // Existing route from the existing code with a different HTTP method and path
  'PUT /api/articles/{id}': {
    path: 'UserController.updateArticle',
    middlewares: [
      auth.service.all()
    ]
  },
}

module.exports = {
  routes,
  MODULE_NAME
}
