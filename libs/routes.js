const mapRoutes = require('express-routes-mapper')
const path = require('path')
const fs = require('fs')
const auth = require('../libs/auth') // Assuming auth is the middleware used for securing routes

module.exports = (app) => {
  const directory = path.resolve(__dirname, '..', 'routes')
  const routeFiles = fs.readdirSync(directory)
  routeFiles.forEach((_route) => {
    const definition = require(`${directory}/${_route}`)
    const tmpRoutes = mapRoutes(definition.routes, 'controllers/')
    app.use(`/${definition.MODULE_NAME}`, tmpRoutes)

    // Register the new route for article listing
    if (definition.MODULE_NAME === 'user') {
      app.get('/user/articles', auth.service.public(), require('../controllers/UserController').listArticles)
    }
  })
}
