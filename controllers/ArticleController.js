const ArticleController = (user) => {
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;
      if (user_id !== user.id) {
        return res.status(403).json({ msg: 'User not authorized' });
      }
      const article = await Article.findOne({
        where: { id, user_id },
        include: ['user']
      });
      if (!article) {
        return res.status(404).json({ msg: 'Article not found' });
      }
      return res.status(200).json({ article });
    } catch (err) {
      return next(err);
    }
  };
  return {
    getArticleDetails,
    // other methods...
  };
};
module.exports = ArticleController;
