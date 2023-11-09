const BaseRepository = require('../repositories/BaseRepository');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { response } = require('../utils/response');
const getArticleDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong format.');
    }
    const article = await BaseRepository.findById(id);
    if (!article) {
      throw new ApiError(httpStatus.NOT_FOUND, 'This article is not found.');
    }
    return response(res, httpStatus.OK, 'Article details', article);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getArticleDetails,
};
