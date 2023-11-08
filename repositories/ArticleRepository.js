const BaseRepository = require('./BaseRepository');
const sequelizeUtils = require('../utils/sequelizeUtils');
const User = require('../models/User'); // Assuming User model exists and is required for association
class ArticleRepository extends BaseRepository {
  constructor() {
    super('Article');
    this.DEFAULT_LIMIT = 10; // Updated default limit as per requirement
    this.DEFAULT_SORT = [['created_at', 'DESC']];
    this.DEFAULT_PAGE = 1; // Updated default page as per requirement
  }
  async getArticlesByUserId(user_id, current_page = this.DEFAULT_PAGE, per_page = this.DEFAULT_LIMIT) {
    // Validate user_id (Assuming a method exists for this purpose)
    if (!await this.isUserValid(user_id)) {
      throw new Error('Invalid user_id or user not logged in');
    }
    const offset = (current_page - 1) * per_page;
    const articles = await this.model.findAll({
      where: { user_id },
      order: this.DEFAULT_SORT,
      offset,
      limit: per_page,
      include: [{ model: User, as: 'user' }]
    });
    // Trim titles and descriptions
    articles.forEach(article => {
      article.title = this.trimText(article.title);
      article.description = this.trimText(article.description);
    });
    const count = await this.countArticlesByUserId(user_id);
    const total_pages = Math.ceil(count / per_page);
    const has_pagination = total_pages > 1;
    return {
      articles,
      total_items: count,
      total_pages,
      has_pagination
    };
  }
  async countArticlesByUserId(user_id) {
    const count = await sequelizeUtils.count(this.model, { user_id });
    return count;
  }
  // Helper method to validate user_id
  async isUserValid(user_id) {
    // Implement user validation logic here
    // For example, check if user_id exists in the User table and if the user is logged in
    // This is a placeholder and should be replaced with actual validation logic
    return true;
  }
  // Helper method to trim text
  trimText(text) {
    // Implement text trimming logic here
    // This is a placeholder and should be replaced with actual trimming logic
    // For example, if the text is longer than a certain length, trim it and append "…"
    return text;
  }
}
module.exports = new ArticleRepository();
