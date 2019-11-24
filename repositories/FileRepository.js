const Repository = require('./Repository')
const factory = require('../utils/repositoryHelper')

class RoleRepository extends Repository {
  constructor () {
    super()
    this.model = factory.getRepositoryModel('file')

    this.STATUS = {
      DELETE: 0,
      NEW: 1,
      APPROVED: 2,
      BANNED: 3
    }
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }

  async bulkCreate (inputs, option = {}) {
    return this.model.bulkCreate(inputs, option)
  }

  async create (input, option = {}) {
    // TODO Extended validator
    return this.model.create({
      ...input
    }, option)
  }

  update (input, query = {}) {
    return this.model
      .update(
        { ...input },
        query
      )
  }

  destroy (options) {
    return this.model.destroy(options)
  }

  findById (uid) {
    return this.model.findByPk(uid)
  }

  findOne (query) {
    return this.model.findOne({
      ...query
    })
  }

  mapGetFilters (filters) {
    return { ...filters }
  }

  get (filters, criteria) {
    filters = this.prepareGetFilters({
      ...criteria,
      ...filters
    })

    return this.model.findAll(filters)
      .then(result => {
        return this.handleResult(result)
      })
  }

  paginate (filters, criteria) {
    filters = this.prepareGetFilters({
      ...criteria,
      ...filters
    })

    return this.model.findAndCountAll(filters)
      .then(result => {
        return this.handlePaginate(result, filters)
      })
  }

  count (filters, criteria) {
    filters = this.prepareGetFilters({
      ...filters,
      ...criteria
    }, true)
    return this.model.count(filters)
      .then(result => {
        return result
      })
  }
}
module.exports = new RoleRepository()
