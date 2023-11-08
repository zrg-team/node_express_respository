const BaseRepository = require('./BaseRepository');
const ApiError = require('../errors/ApiError');
class UserRepository extends BaseRepository {
  constructor() {
    super('user');
    this.DEFAULT_LIMIT = 20;
    this.DEFAULT_SORT = [['id', 'DESC']];
    this.DEFAULT_PAGE = 0;
  }
  async updateLoggedInStatus(user_id, logged_in) {
    try {
      const user = await this.findById(user_id);
      if (!user) {
        throw new ApiError('User not found', 404);
      }
      await this.update(user_id, { logged_in });
      return { message: 'Logged-in status updated successfully.' };
    } catch (error) {
      throw new ApiError(error.message, error.status || 500);
    }
  }
}
module.exports = new UserRepository();
