const dbService = require('.././libs/db')

class RawRepository {
  select (query, options = {}) {
    const { replacements, bind, ...rest } = options
    return dbService.database.query(query,
      { bind, replacements, type: dbService.database.QueryTypes.SELECT, ...rest }
    ).then(result => {
      return result
    })
  }
}
module.exports = new RawRepository()
