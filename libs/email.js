const fs = require('fs')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const config = require('../config')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: config.email.name,
    pass: config.email.secret
  }
})

function sendMail (type, data = {}, mailOptions = {}) {
  try {
    const source = fs.readFileSync(`../emails/${type}.email`, 'utf8')
    const template = handlebars.compile(source)
    const html = template(data)
    const ignoreError = !!mailOptions.ignoreError
    delete mailOptions.ignoreError
    return new Promise((resolve, reject) => transporter.sendMail({
      from: config.email.name,
      html,
      ...mailOptions
    }, function (err, info) {
      if (err) {
        if (ignoreError) {
          return resolve(false)
        }
        return reject(err)
      }
      resolve(info)
    }))
  } catch (err) {
    return false
  }
}

module.exports = {
  sendMail
}
