
const status = require('http-status')
const ApiError = require('./api-error')
const { EmailAlreadyExistsError, InvalidEmailFormatError, PasswordMismatchError, ServerError } = require('./api-error')

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
      throw new ApiError(errors, status.BAD_REQUEST)
    }

    // Custom error handling for user registration
    if (err instanceof EmailAlreadyExistsError) {
      return res.status(err.status).json({ success: false, message: err.message })
    }
    if (err instanceof InvalidEmailFormatError) {
      return res.status(err.status).json({ success: false, message: err.message })
    }
    if (err instanceof PasswordMismatchError) {
      return res.status(err.status).json({ success: false, message: err.message })
    }
    if (err instanceof ServerError) {
      return res.status(err.status).json({ success: false, message: err.message })
    }

    // Continue with the next error middleware
    next(err)
  }
}
