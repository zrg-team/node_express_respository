const BaseRepository = require('./BaseRepository')
const Shop = require('../models/shop')
const { transaction } = require('../utils/transaction')
const ApiError = require('../utils/api-error')
class ShopRepository extends BaseRepository {
  constructor () {
    super('shop')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async updateShop(id, name, address) {
    let updatedShop;
    try {
      await transaction(async () => {
        const shop = await Shop.findByPk(id);
        if (!shop) {
          throw new ApiError('Shop not found', 404);
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
module.exports = new ShopRepository()
