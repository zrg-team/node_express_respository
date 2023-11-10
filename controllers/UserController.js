const userRepository = require('../repositories/UserRepository')
const auth = require('../libs/auth')
const response = require('../utils/response')
const ApiError = require('../utils/api-error')
const status = require('http-status')
const bcrypt = require('bcryptjs')
const mailer = require('../libs/mailer')
const UserController = () => {
  // ... other functions
  const updateUserProfile = async (req, res, next) => {
    try {
      const { id, name, email, password } = req.body
      const user = await userRepository.findOne({ where: { id } })
      if (!user) {
        return next(new ApiError('User not found', status.NOT_FOUND))
      }
      const isVerified = auth.utils.verify(id)
      if (!isVerified) {
        return next(new ApiError('Unauthorized', status.UNAUTHORIZED))
      }
      const existingEmailUser = await userRepository.findOne({ where: { email } })
      if (existingEmailUser && existingEmailUser.id !== id) {
        return next(new ApiError('Email is already registered', status.BAD_REQUEST))
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      await userRepository.update(id, { name, email, password: hashedPassword })
      if (user.email !== email) {
        await mailer.sendEmail({
          to: email,
          subject: 'Email Changed',
          text: 'Your email has been successfully changed. Please confirm your new email by clicking the link in this email.',
        })
      }
      const updatedUser = await userRepository.findOne({ where: { id } })
      return response(res).success({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email })
    } catch (err) {
      return next(err)
    }
  }
  return {
    // ... other exported functions
    updateUserProfile,
  }
}
module.exports = UserController
