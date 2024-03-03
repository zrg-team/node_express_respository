
const status = require('http-status')
const { ApiError, ArticleNotFoundError, UserNotFoundError, ContentRequiredError, EmailAlreadyExistsError, InvalidEmailFormatError, PasswordMismatchError, ServerError, ValidationError } = require('./api-error')

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
    if (err instanceof ApiError) {
      return res.status(err.status).json({ success: false, message: err.message });
    }

    // Handle specific custom errors
    if (err instanceof ArticleNotFoundError || err instanceof UserNotFoundError || err instanceof ContentRequiredError || err instanceof EmailAlreadyExistsError || err instanceof InvalidEmailFormatError || err instanceof PasswordMismatchError || err instanceof ServerError) {
      return res.status(err.status).json({ success: false, message: err.message });
    }

    // Handle validation errors
    if (err instanceof ValidationError) {
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: err.message,
        errors: err.errors
      });
    }

    // Fallback to generic error handling
    const errorCode = err.status || status.INTERNAL_SERVER_ERROR;
    const errorMessage = err.message || 'An unexpected error occurred.';

    return res.status(errorCode).json({
      success: false,
      message: errorMessage
    });
  }
}
