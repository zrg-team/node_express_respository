'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'First Article',
      description: 'This is the first article',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', null, {})
  }
}
