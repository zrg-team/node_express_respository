const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const userRepository = require('../repositories/UserRepository')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const auth = require('../libs/auth')
const UserController = () => {
  const login = async (req, res, next) => {
    try {
      const schema = Joi.object({
        username: Joi.string().required().error(new Error('The username is required.')),
        password: Joi.string().required().error(new Error('The password is required.')),
      })
      const { error, value } = schema.validate(req.body)
      if (error) {
        return next(new ApiError(error.message, 400))
      }
      const user = await userRepository.getUser(value.username)
      if (!user) {
        return next(new ApiError('User does not exist', 404))
      }
      const match = await bcrypt.compare(value.password, user.password)
      if (!match) {
        return next(new ApiError('Invalid password', 401))
      }
      const token = auth.generateToken(user.id)
      return response.success(res, { status: 200, user: { id: user.id, username: user.username }, token })
    } catch (err) {
      return next(err)
    }
  }
  return {
    login,
  }
}
module.exports = UserController
