const auth = require('.././libs/auth')
const file = require('.././libs/files')
const MODULE_NAME = 'user'
const routes = {
  // ... other routes
  'GET /api/articles': {
    path: 'ArticleController.getArticles',
    middlewares: [
      auth.service.all(),
    ]
  },
}
module.exports = {
  routes,
  MODULE_NAME
}
