const db = require('../models');
const BaseRepository = require('./BaseRepository');
const SequelizeUtils = require('../utils/SequelizeUtils');
class ArticleRepository extends BaseRepository {
    constructor() {
        super(db, 'Article');
    }
    // Existing methods...
    async update(id, newDetails) {
        if (typeof id !== 'number') {
            throw new Error('Wrong format');
        }
        if (newDetails.title.length > 100) {
            throw new Error('You cannot input more 100 characters.');
        }
        if (!newDetails.title.trim()) {
            throw new Error('The title is required.');
        }
        if (newDetails.content.length > 10000) {
            throw new Error('You cannot input more 10000 characters.');
        }
        try {
            const updatedArticle = await this.findByIdAndUpdate(id, newDetails);
            if (!updatedArticle) {
                throw new Error('This article is not found');
            }
            return updatedArticle;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new ArticleRepository();
