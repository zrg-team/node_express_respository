
const status = require('http-status')
const ApiError = require('./api-error')

const ARTICLE_ERRORS = {
  INVALID_STATUS: 'INVALID_STATUS'
}

const parseArticleErrors = (error) => {
  if (error instanceof ApiError && error.status === status.BAD_REQUEST && error.message === ARTICLE_ERRORS.INVALID_STATUS) {
    return [{ field: 'status', message: 'Invalid status parameter' }]
  }
  return []
}

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
      errors = [this.parseSQLErrors(err.original)]
    } else if (err && err.errors) {
      errors = []
      err.errors.forEach(element => {
        errors.push({
          field: element.path,
          value: element.value,
          message: element.message
        })
      })
    } else {
      errors = parseArticleErrors(err)
    }
    if (errors && errors.length > 0) {
      throw new ApiError(errors, status.BAD_REQUEST)
    }
    next(err)
  },
  parseArticleErrors
}
