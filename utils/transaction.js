const status = require('http-status')
const ApiError = require('../utils/api-error')
const errorParser = require('../utils/errors')
const { Article, User } = require('../models') // Assuming models are exported from /models/index.js
const dbService = require('.././libs/db')

module.exports = {
  process: async (process, option = { autocommit: false }) => {
    let transaction
    try {
      // get transaction
      transaction = await dbService.database.transaction(option)
      // Check if the process is for creating an article
      if (process.name === 'createArticleProcess') {
        // Validate user existence
        const user = await User.findByPk(process.arguments[0].user_id)
        if (!user) {
          throw new ApiError([{ message: "User not found." }], status.NOT_FOUND)
        }
        // Validate title and content
        if (!process.arguments[0].title || process.arguments[0].title.length > 200) {
          throw new ApiError([{ message: "The title is required and cannot be more than 200 characters." }], status.UNPROCESSABLE_ENTITY)
        }
        if (!process.arguments[0].content) {
          throw new ApiError([{ message: "The content is required." }], status.UNPROCESSABLE_ENTITY)
        }
      }
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
  }
}
