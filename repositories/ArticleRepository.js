const dbService = require('.././libs/db')
class ArticleRepository {
  getArticleById (user_id, article_id) {
    return dbService.database.query('SELECT * FROM articles WHERE id = :article_id AND user_id = :user_id',
      { 
        replacements: { article_id: article_id, user_id: user_id }, 
        type: dbService.database.QueryTypes.SELECT 
      }
    ).then(result => {
      if(result.length > 0) {
        return result[0]
      } else {
        throw new Error('Unauthorized or Article not found')
      }
    })
  }
}
module.exports = new ArticleRepository()
