const auth = require('.././libs/auth')
const file = require('.././libs/files')
const MODULE_NAME = 'user'
const routes = {
  // other routes...
  'GET /api/articles': {
    path: 'ArticleController.getArticlesList',
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
