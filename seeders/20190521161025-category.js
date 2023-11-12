'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [{
      name: 'Technology'
    }, {
      name: 'Business'
    }, {
      name: 'Lifestyle'
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3]
      }
    }, {})
  }
}
