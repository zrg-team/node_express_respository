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
    return { items: items.map(item => ({...item, title: this.trimText(item.title, 2), description: this.trimText(item.description, 2)})), total, totalPages };
  }
  trimText(text, lineCount) {
    const words = text.split(' ');
    let trimmedText = '';
    let line = 1;
    for (let i = 0; i < words.length; i++) {
      if ((trimmedText + words[i]).length > lineCount * 50) {
        if (line === lineCount) {
          return trimmedText + '...';
        }
        line++;
        trimmedText += '\n';
      }
      trimmedText += ' ' + words[i];
    }
    return trimmedText;
  }
}
module.exports = new ArticleRepository();
