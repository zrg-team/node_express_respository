const BaseRepository = require('../repositories/BaseRepository');
const Article = require('../models/Article');
class ArticleController {
    ...
    async deleteArticle(req, res) {
        const { id } = req.params;
        const article = await BaseRepository.findById(Article, id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        await BaseRepository.delete(Article, id);
        return res.status(200).json({ message: 'Article deleted successfully' });
    }
    ...
}
module.exports = ArticleController;
