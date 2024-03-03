const { Op } = require('sequelize');
const BaseRepository = require('./BaseRepository');

class ArticleRepository extends BaseRepository {
  constructor(models) {
    super(models.Article);
    this.models = models;
  }

  async findArticles({ page = 1, limit = 10, category_id, author_id }) {
    const where = {};
    if (category_id) {
      where.category_id = category_id;
    }
    if (author_id) {
      where.author_id = author_id;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.model.findAndCountAll({
      where,
      limit,
      offset,
    });

    return {
      articles: rows,
      total: count,
    };
  }
}

module.exports = new ArticleRepository(require('../models'));
