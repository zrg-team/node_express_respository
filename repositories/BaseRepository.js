const factory = require('../utils/repositoryHelper')
const sequelizeUtils = require('../utils/sequelizeUtils')
class BaseRepository {
  constructor (model) {
    if (model) {
      this.model = factory.getRepositoryModel(model)
    }
  }
  getArticles(page = 1) {
    const limit = 10; // Define the number of articles per page
    const offset = (page - 1) * limit;
    const order = [['created_at', 'DESC']];
    return sequelizeUtils.findAll(this.model, { offset, limit, order });
  }
  getArticleData() {
    return this.model.findAll({
      attributes: ['title', 'description', 'created_at'],
      order: [['created_at', 'DESC']]
    });
  }
  getTotalItems() {
    return this.model.count();
  }
  getTotalPages() {
    return this.getTotalItems().then(totalItems => Math.ceil(totalItems / 10));
  }
}
module.exports = BaseRepository
