const status = require('http-status')
const ApiError = require('../utils/api-error')

const SQL_ERRORS = {
  ER_DATA_TOO_LONG: 'ER_DATA_TOO_LONG'
}

module.exports = {
  parseErrors: (arr) => {
    const errors = []
    Object.keys(arr).forEach((key, index) => {
      const element = arr[key]
      errors.push({
        field: element.context.key,
        value: element.context.value,
        message: element.message
      })
    })
    return errors
  },
  parseSQLErrors: (inputError) => {
    try {
      if (SQL_ERRORS[inputError.code]) {
        switch (inputError.code) {
          case SQL_ERRORS.ER_DATA_TOO_LONG:
            return {
              field: new RegExp("(?<=column ')(.*?)(?=s*')").exec(inputError.sqlMessage)[0],
              message: inputError.sqlMessage
            }
        }
      }
      throw new Error('CAN_NOT_HANDLE')
    } catch (err) {
      throw inputError
    }
  },
  middleware: (err, req, res, next) => {
    let errors = null
    if (err.name === 'SequelizeDatabaseError' && err.original) {
      errors = [this.parseSQLErrors.parseSQLErrors(err.original)]
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
      // Custom error handling for article update process
      if (err.message === 'This article is not found.') {
        errors = [{
          field: 'id',
          message: 'This article is not found.'
        }]
      } else if (err.message === 'Wrong format.') {
        errors = [{
          field: 'id',
          message: 'Wrong format.'
        }]
      } else if (err.message === 'You cannot input more than 100 characters.') {
        errors = [{
          field: 'title',
          message: 'You cannot input more than 100 characters.'
        }]
      } else if (err.message === 'The title is required.') {
        errors = [{
          field: 'title',
          message: 'The title is required.'
        }]
      } else if (err.message === 'You cannot input more than 10000 characters.') {
        errors = [{
          field: 'content',
          message: 'You cannot input more than 10000 characters.'
        }]
      }
      throw new ApiError(errors, status.BAD_REQUEST)
    }
  }
}
