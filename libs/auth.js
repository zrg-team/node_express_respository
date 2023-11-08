// PATH: /libs/auth.js
const jwt = require('jsonwebtoken')
const status = require('http-status')
const ApiError = require('../utils/api-error')
const config = require('../config')
const utils = {
  issue: (payload, expiresIn = 1000800) => jwt.sign(payload, config.jwt.secret, { expiresIn }),
  verify: (token, cb) => jwt.verify(token, config.jwt.secret, {}, cb),
  generateToken: (user) => {
    const payload = {
      sub: user.id,
      username: user.username,
      loggedIn: user.logged_in
    };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
  }
}
// ... rest of the code
