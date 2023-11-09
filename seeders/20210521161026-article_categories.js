'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('article_categories', [{
      id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('article_categories', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
