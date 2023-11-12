const BaseRepository = require('../repositories/BaseRepository');
const ArticleRepository = require('../repositories/ArticleRepository');
const Article = require('../models/Article');
class ArticleController {
  async getArticleDetails(req, res) {
    const { id } = req.params;
    const article = await ArticleRepository.getArticleById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    return res.json({
      id: article.id,
      title: article.title,
      content: article.content,
      created_by: article.created_by
    });
  }
  async deleteArticle(req, res) {
    const { id } = req.params;
    const article = await BaseRepository.findById(Article, id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    await BaseRepository.delete(Article, id);
    return res.status(200).json({ message: 'Article deleted successfully' });
  }
}
module.exports = new ArticleController();
