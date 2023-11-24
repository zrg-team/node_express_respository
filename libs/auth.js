const jwt = require('jsonwebtoken')
const status = require('http-status')
const ApiError = require('../utils/api-error')
const config = require('../config')
const utils = {
  issue: (payload, expiresIn = 1000800) => jwt.sign(payload, config.jwt.secret, { expiresIn }),
  verify: (token, cb) => jwt.verify(token, config.jwt.secret, {}, cb),
  generateToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
  },
  checkShopUpdatePermission: (user) => {
    if (user.role !== 'admin') {
      throw new ApiError('You dont have permission!', status.UNAUTHORIZED);
    }
    return true;
  }
}
// ... rest of the code
module.exports = {
  service,
  utils
}
