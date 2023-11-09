const auth = require('.././libs/auth')
const file = require('.././libs/files')
const MODULE_NAME = 'user'
const routes = {
  ...
  'GET /articles': {
    path: 'UserController.getArticles',
    middlewares: [
      auth.utils.verify(),
      file.all.none()
    ]
  }
}
module.exports = {
  routes,
  MODULE_NAME
}
