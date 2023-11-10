const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const status = require('http-status')
const ApiError = require('../utils/api-error')
const errorParser = require('../utils/errors')
const dbService = require('.././libs/db')
const User = require('../models/User')
module.exports = {
  process: async (process, option = { autocommit: false }) => {
    let transaction
    try {
      // get transaction
      transaction = await dbService.database.transaction(option)
      const result = await process(transaction)
      // commit
      await transaction.commit()
      return result
    } catch (err) {
      await transaction.rollback().catch(() => {})
      let errors = null
      if (err.name === 'SequelizeDatabaseError' && err.original) {
        errors = [errorParser.parseSQLErrors(err.original)]
      } if (err && err.errors) {
        errors = []
        err.errors.forEach(element => {
          errors.push({
            field: element.path,
            value: element.value,
            message: element.message
          })
        })
      }
      if (errors) {
        throw new ApiError(errors, status.BAD_REQUEST)
      }
      throw new ApiError(err)
    }
  },
  updateUser: async (userId, userData) => {
    return await module.exports.process(async (transaction) => {
      const user = await User.findByPk(userId, { transaction })
      if (!user) {
        throw new ApiError('User not found', status.NOT_FOUND)
      }
      if (userData.email !== user.email) {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
          throw new ApiError('Email already registered', status.BAD_REQUEST)
        }
        // Send confirmation email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'your-email@gmail.com',
            pass: 'your-password'
          }
        });
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: userData.email,
          subject: 'Email Confirmation',
          text: 'Please click the link to confirm your new email address: http://your-website.com/confirm-email?email=' + userData.email
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
      userData.password = await bcrypt.hash(userData.password, 10);
      await user.update(userData, { transaction })
      return user
    })
  }
}
