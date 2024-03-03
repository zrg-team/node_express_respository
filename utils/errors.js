const status = require('http-status')
const ApiError = require('./api-error')

const parseJoiErrors = (joiError) => {
  return joiError.details.map(detail => ({
    field: detail.path.join('.'),
    value: detail.context.value,
    message: detail.message.replace(/['"]/g, '')
  }));
};

module.exports.parseJoiErrors = parseJoiErrors;

const SQL_ERRORS = {
  ER_DATA_TOO_LONG: 'ER_DATA_TOO_LONG'
}

module.exports = {
  parseErrors: (arr) => {
    const errors = []
    Object.keys(arr).forEach((key, index) => {
      const element = arr[key]
    arr.forEach((element) => {
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
        // Existing SQL error parsing logic
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
      errors = [this.parseSQLErrors(err.original)]
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
