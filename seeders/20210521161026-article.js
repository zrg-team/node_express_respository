'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'First Article',
      description: 'This is the first article',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      title: 'Second Article',
      description: 'This is the second article',
      user_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', null, {})
  }
}
