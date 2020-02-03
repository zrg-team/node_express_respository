const BaseRepository = require('./BaseRepository')

class FileRepository extends BaseRepository {
  constructor () {
    super('file')
  }

  async bulkCreate (inputs, option = {}) {
    return this.model.bulkCreate(inputs, option)
  }
}
module.exports = new FileRepository()
