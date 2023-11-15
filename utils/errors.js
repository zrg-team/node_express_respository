const status = require('http-status')
const ApiError = require('./api-error')
const SQL_ERRORS = {
  ER_DATA_TOO_LONG: 'ER_DATA_TOO_LONG'
}
const PARAMETER_ERRORS = {
  INVALID_PAGE: 'Invalid page parameter',
  INVALID_LIMIT: 'Invalid limit parameter',
  PAGE_LESS_THAN_ONE: 'Page must be greater than 0.',
  WRONG_FORMAT: 'Wrong format.'
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
  parseParameterErrors: (inputError) => {
    try {
      if (PARAMETER_ERRORS[inputError.code]) {
        return {
          field: inputError.field,
          message: PARAMETER_ERRORS[inputError.code]
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
      throw new ApiError(errors, status.BAD_REQUEST)
    }
  }
}
