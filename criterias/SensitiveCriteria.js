const ICriteria = require('./ICriteria')

class SensitiveCriteria extends ICriteria {
  constructor () {
    super()
    this.name = 'SensitiveCriteria'
    this.destination = null
    this.exclude = []
  }

  association (destination) {
    this.destination = destination
    return this
  }

  contactInfo () {
    this.exclude = ['email', 'phone', 'address']
    return this
  }

  filter (req = {}, model, repository = {}) {
    try {
      let attributes = {}
      const where = {}
      const include = []
      if (req.token && req.token.reference_id) {
        switch (req.token.type_code) {
          case 'USER':
            attributes = { exclude: this.exclude }
            break
          default:
            break
        }
      }
      this.destination = null
      this.exclude = []
      return {
        attributes,
        where,
        include
      }
    } catch (err) {
      return {}
    }
  }
}

module.exports = SensitiveCriteria
