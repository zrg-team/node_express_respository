
const Sequelize = require('sequelize')
const ICriteria = require('./ICriteria')
const Op = Sequelize.Op
const moment = require('moment')

class DefaultCriteria extends ICriteria {
  constructor () {
    super()
    this.version = '1.0.1'
    this.name = 'DefaultCriteria'
    this.MAX_SEARCH = 100
    this.operators = {
      '=': Op.eq,
      '>': Op.gt,
      '<': Op.lt,
      '>=': Op.gte,
      '<=': Op.lte,
      '!=': Op.ne,
      like: Op.like,
      notLike: Op.notLike,
      in: Op.in,
      notIn: Op.notIn,
      between: Op.between,
      notBetween: Op.notBetween
    }
    this.criterias = [] // Added to store criteria for addFilter method
  }

  mapCriteriaToSequilize (searchJoin, input, model) {
    if (searchJoin === 'or') {
      return {
        [Op.or]: input.map(item => {
          if (!this.operators[item.type]) {
            return null
          }
          return {
            [this.operators[item.type]]: this.mapFieldToValue({
              key: item.key,
              subKey: item.subKey,
              value: item.value,
              model,
              operator: item.type
            })
          }
        }).filter(item => item)
      }
    } else {
      return input.reduce((all, item) => {
        if (!this.operators[item.type]) {
          return all
        }
        return {
          ...all,
          [item.key]: {
            [this.operators[item.type]]: this.mapFieldToValue({
              key: item.key,
              subKey: item.subKey,
              value: item.value,
              model,
              operator: item.type
            })
          }
        }
      }, {})
    }
  }

  mapTypeToVale (type, value) {
    if (value === '_NULL_') {
      return null
    }
    switch (type) {
      case 'INTEGER':
        return parseInt(value)
      case 'DATE':
        return new Date(value)
      case 'STRING':
        return String(value)
      default:
        return value
    }
  }

  addFilter(key, value, operator = '=') {
    if (!this.operators[operator]) {
      throw new Error(`Operator ${operator} is not supported`)
    }
    if (key === 'publish_date' && operator === '=') {
      const dateValue = moment(value).startOf('day')
      this.criterias.push({
        key,
        value: {
          [Op.gte]: dateValue.toDate(),
          [Op.lt]: dateValue.add(1, 'days').toDate()
        },
        type: 'between'
      })
    } else {
      this.criterias.push({ key, value, type: operator })
    }
  }

  mapFieldToValue ({
    key,
    subKey,
    value,
    model,
    operator
  }) {
    let type = ''
    if (key && !subKey && model.tableAttributes[key]) {
      type = model.tableAttributes[key].type.constructor.key
    } else if (
      subKey &&
      model.associationModels &&
      model.associationModels[subKey].tableAttributes[key]
    ) {
      type = model.associationModels[subKey].tableAttributes[key].type.constructor.key
    }
    if (['in', 'notIn'].includes(operator)) {
      const values = value.split(',')
      return values.map(item => {
        return this.mapTypeToVale(type, item)
      })
    } else if (['between', 'notBetween'].includes(operator)) {
      const values = value.split(',')
      return [0, 1].map(item => {
        return this.mapTypeToVale(type, values[item])
      })
    }
    return this.mapTypeToVale(type, value)
  }

  parseIncludes (includes, subCriterias, subFields, parsedIncludeNotRequired, model) {
    let group = []
    const result = includes.map(item => {
      if (!subCriterias[item]) {
        const values = item.split('.', 3)
        if (values.length === 2) {
          const condition = this.parseSpecialCondition(item, subFields[item])
          if (condition.group) {
            group = [...group, ...condition.group]
          }
          const shift = values.shift()
          return {
            association: shift,
            include: `${values}`.split(',', 3),
            required: !parsedIncludeNotRequired.includes(shift)
          }
        }
        return item
      } else {
        const values = subCriterias[item]
        const condition = this.parseSpecialCondition(item, subFields[item])
        if (condition.group) {
          group = [...group, ...condition.group]
        }
        return {
          association: item,
          where: this.mapCriteriaToSequilize('and', values, model),
          required: !parsedIncludeNotRequired.includes(item)
        }
      }
    })
    return {
      includes: result,
      group
    }
  }

  parseSpecialCondition (table, input) {
    if (!input) {
      return {}
    }
    const fields = []
    const group = []
    input.forEach(item => {
      const values = item.split(':', 2)
      switch (values[0]) {
        case this.supporedConditions.count:
          fields.push([Sequelize.fn('COUNT', Sequelize.col(`${table}.id`)), values[0]])
          group.push(`${table}.${values[1]}`)
          break
        default:
          fields.push(values[0])
          break
      }
    })
    return {
      attributes: fields.length ? fields : undefined,
      group: group.length ? group : undefined
    }
  }

  filter (req = {}, model, repository = {}) {
    const {
      query = {
        search: '',
        searchFields: '',
        searchJoin: '',
        fields: '',
        includeNotRequired: '',
        includes: undefined,
        page: undefined,
        limit: undefined,
        order: undefined
      }
    } = req
    try {
      const parsedSearch = query.search ? `${query.search}`.split(';', this.MAX_SEARCH) : []
      const parsedQuery = query.searchFields ? `${query.searchFields}`.split(';', this.MAX_SEARCH) : []
      const parsedFields = query.fields ? `${query.fields}`.split(';', this.MAX_SEARCH) : undefined
      const parsedOrder = query.order ? `${query.order}`.split(':', 2) : undefined
      const parsedIncludeNotRequired = query.includeNotRequired
        ? `${query.includeNotRequired}`.split(';', this.MAX_SEARCH) : []
      const subCriterias = {}
      const searchFields = {}
      const subFields = {}
      const criterias = []
      const fields = []
      let includes
      let group
      if (parsedQuery.length) {
        parsedQuery.forEach(item => {
          const values = `${item}`.split(':', 2)
          if (values.length === 2) {
            searchFields[values[0]] = values[1]
          }
        })
      }
      parsedFields && parsedFields.filter((item) => {
        const parsed = `${item}`.split('.', 2)
        if (parsed.length > 1) {
          if (!subFields[parsed[0]]) {
            subFields[parsed[0]] = []
          }
          subFields[parsed[0]].push(parsed[1])
        } else {
          fields.push(item)
        }
      })
      if (parsedSearch.length) {
        parsedSearch.forEach((item) => {
          const values = item.split(':', 2)
          if (
            values.length === 2 &&
            (
              !repository.fieldSearchable ||
              repository.fieldSearchable[values[0]]
            )
          ) {
            const splitedFields = values[0].split('.', 2)
            const field = splitedFields.length > 1
              ? splitedFields[splitedFields.length - 1]
              : values[0]
            if (splitedFields.length === 1) {
              criterias.push({
                key: values[0],
                value: values[1],
                type: searchFields[values[0]] || '='
              })
            } else {
              if (!subCriterias[splitedFields[0]]) {
                subCriterias[splitedFields[0]] = []
              }
              subCriterias[splitedFields[0]].push({
                key: field,
                subKey: splitedFields[0],
                value: values[1],
                type: searchFields[values[0]] || '='
              })
            }
          }
        })
      }
      if (query.includes) {
        const parsedIncludes = `${query.includes}`.split(';', this.MAX_SEARCH)
        if (parsedIncludes.length) {
          const data = this.parseIncludes(
            parsedIncludes,
            subCriterias,
            subFields,
            parsedIncludeNotRequired,
            model)
          includes = data.includes
          group = data.group
        }
      }
      const results = {
        include: includes || undefined,
        group: group && group.length ? group : undefined,
        page: query.page ? +query.page : undefined,
        limit: query.limit ? +query.limit : undefined,
        attributes: fields.length ? fields : undefined,
        order: parsedOrder ? [[parsedOrder[0], parsedOrder[1] || 'ASC']] : undefined,
        where: this.mapCriteriaToSequilize(query.searchJoin || 'and', criterias, model)
      }
      const filters = Object.keys(results).reduce((all, key) => {
        if (!results[key]) {
          return all
        }
        return { ...all, [key]: results[key] }
      }, {})
      return filters
    } catch (err) {
      console.log('err', err)
      return {}
    }
  }
}

module.exports = DefaultCriteria
