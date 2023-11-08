const express = require('express');
const router = express.Router();
const { getArticleList } = require('../controllers/articles');
const { check, validationResult } = require('express-validator');
router.get('/api/articles', [
  check('page').isNumeric().withMessage('Wrong format.').isInt({ gt: 0 }).withMessage('Page must be greater than 0.'),
  check('limit').isNumeric().withMessage('Wrong format.')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { page, limit } = req.query;
  getArticleList(page, limit)
    .then(data => res.json(data))
    .catch(next);
});
module.exports = router;
