class ICriteria {
  constructor () {
    if (this.filter === undefined || typeof this.filter !== 'function') {
      throw new Error('Must override .filter() method')
    }
  }

  filter (req, model, repository) {
  }
}

module.exports = ICriteria
