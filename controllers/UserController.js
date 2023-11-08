const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const userRepository = require('../repositories/UserRepository')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const auth = require('../libs/auth')
const UserController = () => {
  // Other functions...
  const login = async (req, res, next) => {
    try {
      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      })
      const { error, value } = schema.validate(req.body)
      if (error) {
        return next(new ApiError(error.details, 400))
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
      return response.success(res, { message: 'Logged in successfully', token })
    } catch (err) {
      return next(err)
    }
  }
  return {
    login,
    // Other exported functions...
  }
}
module.exports = UserController
