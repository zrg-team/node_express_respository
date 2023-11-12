const db = require('../models');
const BaseRepository = require('./BaseRepository');
const SequelizeUtils = require('../utils/SequelizeUtils');
class ArticleRepository extends BaseRepository {
    constructor() {
        super(db, 'Article');
    }
    async get(filters, criteria, page = 1, sortBy = 'createdAt DESC') {
        let query = 'SELECT * FROM articles WHERE 1=1';
        if (filters) {
            for (let key in filters) {
                query += ` AND ${key} = ${filters[key]}`;
            }
        }
        if (sortBy) {
            query += ` ORDER BY ${sortBy}`;
        }
        if (page) {
            const limit = 10; // number of records per page
            const offset = (page - 1) * limit;
            query += ` LIMIT ${limit} OFFSET ${offset}`;
        }
        const result = await db.query(query);
        const totalItems = await this.count(filters);
        const totalPages = Math.ceil(totalItems / limit);
        return { articles: result, totalItems, totalPages };
    }
    async count(filters) {
        let query = 'SELECT COUNT(*) as count FROM articles WHERE 1=1';
        if (filters) {
            for (let key in filters) {
                query += ` AND ${key} = ${filters[key]}`;
            }
        }
        const result = await db.query(query);
        return result[0].count;
    }
    async getArticleById(id) {
        const article = await this.model.findByPk(id);
        if (!article) {
            throw new Error('Article not found');
        }
        return article;
    }
    async deleteArticle(articleId) {
        try {
            const article = await this.findOne({ id: articleId });
            if (!article) {
                throw new Error('Article not found');
            }
            await this.delete({ id: articleId });
            return 'Article has been deleted successfully';
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new ArticleRepository();
