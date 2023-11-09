const validateArticleListParams = (req, res, next) => {
  const { page, limit } = req.query;
  if (!Number.isInteger(Number(page)) || Number(page) <= 0) {
    return res.status(422).json({ message: 'Page must be an integer and greater than 0.' });
  }
  if (!Number.isInteger(Number(limit))) {
    return res.status(422).json({ message: 'Limit must be an integer.' });
  }
  next();
};
module.exports = {
  validateArticleListParams,
};
