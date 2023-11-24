const status = require('http-status')
const ApiError = require('../utils/api-error')
module.exports = (res = {}) => {
  const isDebug = process.env.DEBUG === 'true'
  return {
    success: (data) => {
      return res
        .status(200)
        .json({ success: true, ...data })
    },
    userUpdateSuccess: (user) => {
      return res
        .status(200)
        .json({ success: true, userId: user.id, userEmail: user.email, userConfirmed: user.confirmed })
    },
    shopUpdateSuccess: (shop) => {
      return res
        .status(200)
        .json({ success: true, shopId: shop.id, shopName: shop.name, shopAddress: shop.address })
    },
    generatingUpdateSuccess: (generating) => {
      return res
        .status(200)
        .json({ success: true, generatingId: generating.id, createdAt: generating.created_at, updatedAt: generating.updated_at })
    },
    sendUpdateConfirmation: ({ id, name, address }) => {
      return res
        .status(200)
        .json({ success: true, id, name, address })
    },
    error: (err) => {
      if (err instanceof ApiError && err.status === status.BAD_REQUEST) {
        return res.status(err.status).json({ success: false, errors: err.message })
      }
      let msg = 'Internal server error'
      let code = status.INTERNAL_SERVER_ERROR
      if (isDebug) {
        if (status[err.status]) {
          code = err.status
        }
        msg = err.stack || err
      }
      return res
        .status(code)
        .json({ success: false, msg })
    }
  }
}
