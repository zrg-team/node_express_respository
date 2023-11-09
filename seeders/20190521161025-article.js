'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'Article 1',
      description: 'Description for article 1',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      title: 'Article 2',
      description: 'Description for article 2',
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      title: 'Article 3',
      description: 'Description for article 3',
      user_id: 3,
      created_at: new Date(),
      updated_at: new Date()
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
