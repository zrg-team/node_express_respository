const auth = require('.././libs/auth')
const file = require('.././libs/files')
const validateArticleRequest = require('../middlewares/validateArticleRequest');
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
  'GET /api/articles': {
    path: 'ArticleController.getArticles',
    middlewares: [
      auth.service.all(),
      file.all.none(),
      validateArticleRequest
    ]
  },
  // other routes...
}
module.exports = {
  routes,
  MODULE_NAME
}
