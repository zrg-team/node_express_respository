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
module.exports = {
  trimArticleFields,
}
