const status = require('http-status')
const ApiError = require('../utils/api-error')
const errorParser = require('../utils/errors')
const dbService = require('.././libs/db')
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
  }
}
