const userRepository = require('../repositories/UserRepository')
const response = require('../utils/response')
const ApiError = require('../utils/api-error')
const status = require('http-status')
const bcrypt = require('../utils/bcrypt')
const validator = require('validator')
const UserController = () => {
  // ... other functions
  const registerUser = async (req, res, next) => {
    try {
      const { name, email, password } = req.body
      if (!name) {
        return next(new ApiError('The name is required.', status.BAD_REQUEST))
      }
      if (!email) {
        return next(new ApiError('The email is required.', status.BAD_REQUEST))
      }
      if (!validator.isEmail(email)) {
        return next(new ApiError('The email is not in valid format.', status.BAD_REQUEST))
      }
      if (!password) {
        return next(new ApiError('The password is required.', status.BAD_REQUEST))
      }
      if (password.length < 8) {
        return next(new ApiError('The password must be at least 8 characters.', status.BAD_REQUEST))
      }
      const existingUser = await userRepository.findOne({ where: { email } })
      if (existingUser) {
        return next(new ApiError('Email is already registered', status.BAD_REQUEST))
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await userRepository.create({ name, email, password: hashedPassword })
      return response(res).success({ id: user.id, name: user.name, email: user.email, created_at: user.createdAt })
    } catch (err) {
      return next(new ApiError('An error occurred while registering the user', status.INTERNAL_SERVER_ERROR))
    }
  }
  return {
    // ... other exported functions
    registerUser,
  }
}
module.exports = UserController
