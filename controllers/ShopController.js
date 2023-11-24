// PATH: /controllers/ShopController.js
const Joi = require('@hapi/joi')
const status = require('http-status')
const auth = require('../libs/auth')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const shopRepository = require('../repositories/ShopRepository')
const ERROR_CODES = {
  SHOP_NOT_EXIST: 'SHOP_NOT_EXIST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  PARAMS_ERROR: 'PARAMS_ERROR',
}
const ShopController = () => {
  const updateShop = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        name: Joi.string().min(3).max(60).required(),
        address: Joi.string().min(3).max(255).required(),
      })
      /** Validate input */
      const validater = Joi.validate(req.body, schema, { abortEarly: false })
      if (validater.error) {
        return next(new ApiError(errorHelper.parseErrors(validater.error.details), status.BAD_REQUEST))
      }
      const { id, name, address } = validater.value;
      // Check if user has necessary permissions
      if (!auth.hasPermission(req.user, 'update_shop')) {
        return next(new ApiError([{
          field: 'user',
          value: req.user.id,
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Unauthorized.'
        }], status.UNAUTHORIZED))
      }
      // Check if shop exists
      let shop = await shopRepository.findOne({ where: { id } })
      if (!shop) {
        return next(new ApiError([{
          field: 'id',
          value: id,
          code: ERROR_CODES.SHOP_NOT_EXIST,
          message: 'Shop not found.'
        }], status.BAD_REQUEST))
      }
      // Update shop
      await shopRepository.update({ name, address }, { where: { id } })
      // Fetch updated shop
      shop = await shopRepository.findOne({ where: { id } })
      return response(res).success({ data: shop })
    } catch (err) {
      return next(err)
    }
  }
  return {
    updateShop,
  }
}
module.exports = ShopController
