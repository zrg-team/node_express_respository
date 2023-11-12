'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('article_categories', [{
      article_id: 1,
      category_id: 1
    }, {
      article_id: 2,
      category_id: 2
    }, {
      article_id: 3,
      category_id: 3
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('article_categories', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3]
      }
    }, {})
  }
}
