// PATH: /seeders/20190521161025-articles.js
'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'Article 1',
      description: 'Description for Article 1',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      title: 'Article 2',
      description: 'Description for Article 2',
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      title: 'Article 3',
      description: 'Description for Article 3',
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
