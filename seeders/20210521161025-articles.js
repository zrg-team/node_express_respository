'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'Article 1',
      description: 'Description for Article 1',
      user_id: 1
    }, {
      title: 'Article 2',
      description: 'Description for Article 2',
      user_id: 2
    }, {
      title: 'Article 3',
      description: 'Description for Article 3',
      user_id: 3
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3]
      }
    }, {})
  }
}
