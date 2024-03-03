const mapRoutes = require('express-routes-mapper')
const path = require('path')
const fs = require('fs')
const userRoutes = require('../routes/user')

module.exports = (app) => {
  const directory = path.resolve(__dirname, '..', 'routes')
  const routeFiles = fs.readdirSync(directory)
  routeFiles.forEach((_route) => {
    const definition = require(`${directory}/${_route}`)
    const tmpRoutes = mapRoutes(definition.routes, 'controllers/')
    app.use(`/${definition.MODULE_NAME}`, tmpRoutes)
  })
  // Include the new route for article tagging
  app.use(`/${userRoutes.MODULE_NAME}`, mapRoutes(userRoutes.routes, 'controllers/'))
}
