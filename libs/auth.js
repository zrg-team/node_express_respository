const jwt = require('jsonwebtoken')
const status = require('http-status')
const ApiError = require('../utils/api-error')
const config = require('../config')
const utils = {
  issue: (payload, expiresIn = 1000800) => jwt.sign(payload, config.jwt.secret, { expiresIn }),
  verify: (token, cb) => jwt.verify(token, config.jwt.secret, {}, cb)
}
function authenticate (req) {
  let tokenToVerify
  if (req.header('Authorization')) {
    const parts = req.header('Authorization').split(' ')
    if (parts.length === 2) {
      const scheme = parts[0]
      const credentials = parts[1]
      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials
      } else {
        throw new ApiError('Format for Authorization: Bearer [token]', status.UNAUTHORIZED)
      }
    } else {
      throw new ApiError('Format for Authorization: Bearer [token]', status.UNAUTHORIZED)
    }
  } else if (req.body && req.body.token) {
    tokenToVerify = req.body.token
    delete req.query.token
  } else {
    throw new ApiError('No Authorization was found', status.UNAUTHORIZED)
  }
  return tokenToVerify
}
function validateToken (type, token) {
  switch (type) {
    case 'ADMIN':
      return token.type_code === 'ADMIN' && token.role_code === 'ADMIN'
    case 'OPERATOR':
      return token.type_code === 'ADMIN' && token.role_code === 'OPERATOR'
  }
}
const service = {
  all: () => (req, res, next) => {
    try {
      const tokenToVerify = authenticate(req)
      return utils.verify(tokenToVerify, (err, thisToken) => {
        if (err) return next(new ApiError(err, status.UNAUTHORIZED))
        req.token = thisToken
        return next()
      })
    } catch (err) {
      return next(err)
    }
  },
  accept: (roles) => {
    return (req, res, next) => {
      try {
        const tokenToVerify = authenticate(req)
        return utils.verify(tokenToVerify, (err, thisToken) => {
          if (err) {
            return next(new ApiError(err, status.UNAUTHORIZED))
          }
          const valid = roles.some((type) => {
            return validateToken(type, thisToken)
          })
          if (!valid) {
            return next(new ApiError('You dont have permission!', status.UNAUTHORIZED))
          }
          req.token = thisToken
          return next()
        })
      } catch (err) {
        return next(err)
      }
    }
  },
  public: () => (req, res, next) => {
    if (
      !req.header('Authorization') &&
      !(req.body && req.body.token)
    ) {
      req.token = {}
      return next()
    }
    try {
      const tokenToVerify = authenticate(req)
      return utils.verify(tokenToVerify, (err, thisToken) => {
        if (err) return next(new ApiError(err, status.UNAUTHORIZED))
        req.token = thisToken
        return next()
      })
    } catch (err) {
      return next(err)
    }
  }
}
module.exports = {
  service,
  utils
}
