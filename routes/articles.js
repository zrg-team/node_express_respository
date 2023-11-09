const express = require('express');
const router = express.Router();
const { getArticleList, getArticleDetail, getArticleListByUser, getArticleDetailByUser } = require('../controllers/articles');
const { check, validationResult } = require('express-validator');
// Existing routes...
router.get('/api/articles/user/:user_id/:article_id', [
  check('user_id').isNumeric().withMessage('Wrong format.'),
  check('article_id').isNumeric().withMessage('Wrong format.')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { user_id, article_id } = req.params;
  getArticleDetailByUser(user_id, article_id)
    .then(data => {
      if (!data) {
        return res.status(404).json({ message: 'This article is not found' });
      }
      res.json({ status: 200, article: data });
    })
    .catch(next);
});
module.exports = router;
