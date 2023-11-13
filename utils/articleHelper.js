function trimArticleDetails(article) {
    const maxLength = 100; // Define the maximum length of title and description
    // Check and trim the title
    if (article.title && article.title.length > maxLength) {
        article.title = article.title.substring(0, maxLength) + '...';
    }
    // Check and trim the description
    if (article.description && article.description.length > maxLength) {
        article.description = article.description.substring(0, maxLength) + '...';
    }
    return article;
}
module.exports = {
    trimArticleDetails
};
