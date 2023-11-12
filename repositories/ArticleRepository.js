const SequelizeUtils = require('../utils/SequelizeUtils');
class ArticleRepository {
    // Other functions...
    async deleteArticle(articleId) {
        try {
            const article = await SequelizeUtils.findOne('articles', { id: articleId });
            if (!article) {
                throw new Error('Article not found');
            }
            await SequelizeUtils.delete('articles', { id: articleId });
            return 'Article has been deleted successfully';
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new ArticleRepository();
