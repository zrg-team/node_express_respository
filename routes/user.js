const auth = require('.././libs/auth')
const file = require('.././libs/files')
const UserController = require('../controllers/UserController');
const MODULE_NAME = 'user'
const routes = {
  ...
  'POST /api/users/register': {
    path: UserController.registerUser,
    middlewares: [
      file.all.none()
    ]
  }
}
module.exports = {
  routes,
  MODULE_NAME
}
