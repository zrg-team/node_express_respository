const auth = require('.././libs/auth')
const file = require('.././libs/files')

const MODULE_NAME = 'post'

const routes = {
  'POST /': {
    path: 'PostController.create',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'PUT /': {
    path: 'PostController.update',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'DELETE /': {
    path: 'PostController.deletePost',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  'GET /': {
    path: 'PostController.find',
    middlewares: [
      auth.service.public(),
      file.all.none()
    ]
  },
  'GET /:id': {
    path: 'PostController.get',
    middlewares: [
      auth.service.public(),
      file.all.none()
    ]
  }
}

module.exports = {
  routes,
  MODULE_NAME
}
