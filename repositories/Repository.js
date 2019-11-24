const factory = require('../utils/repositoryHelper')

class Repository {
  constructor (model) {
    if (this.create === undefined || typeof this.create !== 'function') {
      throw new Error('Must override .create() method')
    }

    if (this.update === undefined || typeof this.update !== 'function') {
      throw new Error('Must override .update() method')
    }

    if (this.get === undefined || typeof this.get !== 'function') {
      throw new Error('Must override .get() method')
    }

    if (this.findOne === undefined || typeof this.findOne !== 'function') {
      throw new Error('Must override .get() method')
    }
    if (model) {
      this.model = factory.getRepositoryModel(model)
    }

    this.STATUS = {
      DELETE: 0,
      NEW: 1,
      APPROVED: 2,
      BANNED: 3,
      REJECT: 4,
      CLOSE: 5
    }

    this.GET_FILTER_PAGE = 'page'
    this.GET_FILTER_LIMIT = 'limit'
    this.GET_FILTER_SORT = 'order'
    this.GET_FILTER_INCLUDE = 'include'
    this.GET_FILTER_WHERE = 'where'
    this.GET_FILTER_ATTRIBUTE = 'attributes'
    this.GET_FILTER_GROUP = 'group'

    this.GET_FILTERS = [
      this.GET_FILTER_SORT,
      this.GET_FILTER_PAGE,
      this.GET_FILTER_LIMIT,
      this.GET_FILTER_WHERE,
      this.GET_FILTER_INCLUDE,
      this.GET_FILTER_ATTRIBUTE,
      this.GET_FILTER_GROUP
    ]
  }

  create (input, option = {}) {
    // TODO Extended validator
    return this.model.create({
      ...input
    }, option)
  }

  update (input, query) {
    return this.model
      .update(
        { ...input },
        query
      )
  }

  findById (uid) {
    return this.model.findByPk(uid)
  }

  findOne (query) {
    return this.model.findOne({
      ...query
    })
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

  prepareGetFilters (filters, count = false) {
    if (filters === undefined) {
      return undefined
    }

    if (!filters[this.GET_FILTER_PAGE] && !count) {
      filters[this.GET_FILTER_PAGE] = this.DEFAULT_PAGE
    }
    if (!filters[this.GET_FILTER_LIMIT] && !count) {
      filters[this.GET_FILTER_LIMIT] = this.DEFAULT_LIMIT
    }
    if (!filters[this.GET_FILTER_SORT] && !count) {
      filters[this.GET_FILTER_SORT] = this.DEFAULT_SORT
    }

    Object.keys(filters).forEach(key => {
      if (this.GET_FILTERS.indexOf(key) < 0) {
        throw new Error('No valid filter passed to repository with key: ' + key)
      }

      if ([this.GET_FILTER_SKIP, this.GET_FILTER_LIMIT].indexOf(key) >= 0) {
        if (isNaN(parseInt(filters[key]))) {
          throw new Error('No valid ' + key + ' value: ' + filters[key])
        }
      }
    })
    const offset = +filters[this.GET_FILTER_PAGE] > 0
      ? (+filters[this.GET_FILTER_PAGE] - 1) * +filters[this.GET_FILTER_LIMIT]
      : 0

    return {
      ...filters,
      offset: !count
        ? offset
        : undefined
    }
  }

  processCriteriaFunction (filters) {
    return {
      findOne: (data) => {
        return this.findOne(data, filters)
      },
      get: (data) => {
        return this.get(data, filters)
      },
      paginate: (data) => {
        return this.paginate(data, filters)
      },
      count: (data) => {
        return this.count(data, filters)
      }
    }
  }

  processCriteria (criteria, rest) {
    return {
      apply: (req) => {
        let filters = criteria.filter(req, this.model, this)
        if (rest && Array.isArray(rest)) {
          rest.forEach((item) => {
            const itemFilters = item.filter(req, this.model, this)
            Object.keys(itemFilters).forEach(key => {
              if (
                Array.isArray(filters[key]) ||
                Array.isArray(itemFilters[key])
              ) {
                filters = {
                  ...filters,
                  [key]: [
                    ...filters[key]
                      ? filters[key] : [],
                    ...itemFilters[key]
                  ]
                }
              } else {
                filters = {
                  ...filters,
                  [key]: {
                    ...filters[key]
                      ? filters[key] : [],
                    ...itemFilters[key]
                  }
                }
              }
            })
          })
        }
        return {
          with: (params = {}) => {
            const additionFilters = this.GET_FILTERS.reduce((all, key) => {
              if (!filters[key] && !params[key]) {
                return all
              }
              if (params[key] && typeof params[key] !== 'object') {
                all[key] = params[key]
              } else if (filters[key] && typeof filters[key] !== 'object') {
                all[key] = filters[key]
              } else if (key === this.GET_FILTER_INCLUDE) {
                const associationFilters = (filters[key] || []).map(item => {
                  if (typeof item === 'object') {
                    return item.association
                  }
                  return item
                })
                const tempFilters = (params[key] || []).filter(item => {
                  return !(
                    (
                      typeof item === 'string' &&
                      associationFilters.includes(item)
                    ) || (
                      typeof item === 'object' &&
                      associationFilters.includes(item.association)
                    )
                  )
                })
                all[key] = [...(filters[key] || []), ...tempFilters]
              } else if ([this.GET_FILTER_GROUP, this.GET_FILTER_SORT].includes(key)) {
                all[key] = [...(filters[key] || []), ...(params[key] || [])]
              } else {
                all[key] = { ...(filters[key] || {}), ...(params[key] || {}) }
              }
              return all
            }, {})
            return this.processCriteriaFunction(additionFilters)
          },
          ...this.processCriteriaFunction(filters)
        }
      }
    }
  }

  pushCriteria (criteria, ...rest) {
    return this.processCriteria(criteria, rest)
  }

  handleResult (result) {
    if (result) {
      return {
        data: result,
        count: result.length
      }
    }
    return {
      data: [],
      count: 0
    }
  }

  handlePaginate (result, filters) {
    return {
      total: result.count,
      limit: filters.limit,
      page: filters.page,
      totalPage: Math.ceil(result.count / filters.limit),
      data: result.rows,
      count: result.rows.length
    }
  }
}

module.exports = Repository
