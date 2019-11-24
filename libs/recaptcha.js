const Recaptcha = require('recaptcha-v2').Recaptcha
const appConfig = require('../config')

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    if (appConfig.recaptcha.skip) {
      return resolve(true)
    }
    const recaptcha = new Recaptcha(
      appConfig.recaptcha.key,
      appConfig.recaptcha.secret,
      {
        ...data,
        secret: appConfig.recaptcha.secret
      }
    )
    recaptcha.verify((success) => {
      if (success) {
        return resolve(true)
      }

      resolve(false)
    })
  })
}
