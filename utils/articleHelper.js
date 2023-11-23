const { trimText } = require('./util');
const trimArticleFields = (article) => {
  const maxLength = 100; // Maximum length for 2 lines of text
  if (article.title.length > maxLength) {
    article.title = article.title.substring(0, maxLength) + '...';
  }
  if (article.description.length > maxLength) {
    article.description = article.description.substring(0, maxLength) + '...';
  }
  return article;
}
const formatArticles = (articles) => {
  return articles.map(article => trimArticleFields(article));
}
const formatArticleData = (articles) => {
  return articles.map(article => {
    article.title = trimText(article.title, 100);
    article.description = trimText(article.description, 100);
    return article;
  });
}
module.exports = {
  trimArticleFields,
  formatArticles,
  formatArticleData,
}
