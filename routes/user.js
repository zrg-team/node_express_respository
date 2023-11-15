const auth = require('.././libs/auth')
const file = require('.././libs/files')
const MODULE_NAME = 'user'
const routes = {
  // other routes...
  'GET /api/articles/:id': {
    path: 'ArticleController.getArticleById',
    middlewares: [
      auth.service.all(),
      file.all.none()
    ]
  },
  // other routes...
}
module.exports = {
  routes,
  MODULE_NAME
}
