const mapRoutes = require('express-routes-mapper')
const path = require('path')
const fs = require('fs')
const DashboardController = require('../controllers/DashboardController')

const dashboardController = DashboardController()

// Define the route for filtering/searching articles
app.get('/api/articles', dashboardController.filterSearchArticles)

module.exports = (app) => {
  const directory = path.resolve(__dirname, '..', 'routes')
  const routeFiles = fs.readdirSync(directory)
  routeFiles.forEach((_route) => {
    const definition = require(`${directory}/${_route}`)
    const tmpRoutes = mapRoutes(definition.routes, 'controllers/')
    app.use(`/${definition.MODULE_NAME}`, tmpRoutes)
  })
}
