const ArticleRepository = require('../repositories/ArticleRepository');
const response = require('../utils/response');
class ArticleController {
    async getArticleDetails(req, res) {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(422).json({ message: 'Wrong format.' });
        }
        const article = await ArticleRepository.getArticleById(id);
        if (!article) {
            return res.status(404).json({ message: 'This article is not found' });
        }
        return res.status(200).json({
            status: 200,
            article: {
                id: article.id,
                title: article.title,
                content: article.content,
                author_id: article.created_by,
                created_at: article.created_at
            }
        });
    }
    // Other methods remain unchanged
}
module.exports = new ArticleController();
