'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('article_categories', [{
      article_id: 1,
      category_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('article_categories', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
