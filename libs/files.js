const multer = require('multer')
const httpStatus = require('http-status')
const ApiError = require('../utils/api-error')

/** Filter list */
const filter = {
  document: (req, file, cb) => {
    const allowTypes = [
      'doc',
      'docx',
      'pdf',
      'ppt',
      'pptx',
      'xls',
      'xlsx'
    ]
    const splitName = file.originalname.split('.')
    const fileExtension = splitName[splitName.length - 1]
    if (!allowTypes.includes(fileExtension)) {
      return cb(new ApiError([
        { field: file.fieldname, value: false, message: `Only ${allowTypes.join(', ')}  files are allowed` }
      ], httpStatus.BAD_REQUEST), false)
    }
    return cb(null, true)
  },
  image: (req, file, cb) => {
    const allowTypes = [
      'jpg',
      'jpeg',
      'jpe',
      'png'
    ]
    const splitName = file.originalname.split('.')
    const fileExtension = splitName[splitName.length - 1]
    if (!allowTypes.includes(fileExtension)) {
      return cb(new ApiError([
        { field: file.fieldname, value: false, message: `Only ${allowTypes.join(', ')} are allowed` }
      ], httpStatus.BAD_REQUEST), false)
    }
    return cb(null, true)
  }
}

/** Storage */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const document = multer({ dest: 'uploads/', storage, fileFilter: filter.document })
const image = multer({ dest: 'uploads/', storage, fileFilter: filter.image })
const all = multer({ dest: 'uploads/', storage })

module.exports = {
  image,
  document,
  all
}
