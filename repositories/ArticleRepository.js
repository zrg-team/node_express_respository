const BaseRepository = require('./BaseRepository');
const Article = require('../models/Article');
class ArticleRepository extends BaseRepository {
  constructor() {
    super(Article);
  }
  async get(articleId) {
    return this.findById(articleId);
  }
  async getByUserId(user_id, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = { where: { user_id }, order: { created_at: 'DESC' }, skip: offset, take: limit };
    const [items, total] = await this.find(query);
    const totalPages = Math.ceil(total / limit);
    return { 
      items: items.map(item => ({
        ...item, 
        title: this.trimText(item.title, 50), 
        description: this.trimText(item.description, 100)
      })), 
      total, 
      totalPages 
    };
  }
  trimText(text, maxLength) {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  }
}
module.exports = new ArticleRepository();
