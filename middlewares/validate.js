const validateArticleListParams = (req, res, next) => {
  const { page, limit } = req.query;
  if (!Number.isInteger(Number(page))) {
    return res.status(422).json({ message: 'Wrong format.' });
  }
  if (!Number.isInteger(Number(limit))) {
    return res.status(422).json({ message: 'Wrong format.' });
  }
  if (Number(page) <= 0) {
    return res.status(422).json({ message: 'Page must be greater than 0.' });
  }
  next();
};
module.exports = {
  validateArticleListParams,
};
