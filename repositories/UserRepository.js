const BaseRepository = require('./BaseRepository')
const User = require('../models/user')
const Shop = require('../models/shop')
const bcrypt = require('bcrypt')
const { transaction } = require('../utils/transaction')
const ApiError = require('../utils/api-error')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async registerUser(email, password, passwordConfirmation) {
    // ... existing code ...
  }
  async confirmEmail(email) {
    // ... existing code ...
  }
  async updateShop(id, name, address, userId) {
    let updatedShop;
    try {
      await transaction(async () => {
        const shop = await Shop.findByPk(id);
        if (!shop) {
          throw new ApiError('Shop not found', 404);
        }
        if (shop.userId !== userId) {
          throw new ApiError('User does not have permission to update this shop', 403);
        }
        shop.name = name;
        shop.address = address;
        updatedShop = await shop.save();
      });
    } catch (error) {
      throw new ApiError('Update operation failed', 500);
    }
    return updatedShop;
  }
}
module.exports = new UserRepository()
