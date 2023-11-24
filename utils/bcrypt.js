const bcrypt = require('bcrypt-nodejs')
const ENV = process.env.NODE_ENV || 'development'
const bcryptService = () => {
  const genSaltSync = () => {
    return bcrypt.genSaltSync()
  }
  const password = (password) => {
    const salt = ENV === 'development'
      ? '$2a$10$RbQQ3zTCiYrniof1ipYgdu'
      : genSaltSync()
    const hash = bcrypt.hashSync(password, salt)
    return hash
  }
  const encryptPassword = (password) => {
    return password(password)
  }
  const comparePassword = (pw, hash) => (
    bcrypt.compareSync(pw, hash)
  )
  return {
    password,
    genSaltSync,
    comparePassword,
    encryptPassword
  }
}
module.exports = bcryptService()
