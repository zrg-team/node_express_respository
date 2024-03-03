const auth = require('../libs/auth')
const file = require('../libs/files')
const validate = require('../middlewares/validate')
const UserController = require('../controllers/UserController')

const MODULE_NAME = 'user'

const routes = {
  'POST /': {
    path: 'UserController.create',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'POST /api/users': {
    path: 'UserController.register',
    middlewares: [
      validate('userRegistration'), // Assuming a validation middleware is set up for user registration
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
  'POST /api/comments': {
    path: 'UserController.postComment',
    middlewares: [
      auth.service.all(), // Use the authentication middleware to ensure only authenticated users can post comments
      file.all.none() // Assuming no file uploads are required for posting comments
    ]
  },
  // Merged new route from new code
  'POST /api/article_tags': {
    path: 'UserController.tagArticle',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  // Existing routes from old code
  'POST /api/article_categories': {
    path: 'UserController.assignArticleToCategory',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'POST /api/comments': {
    path: 'UserController.postComment',
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
