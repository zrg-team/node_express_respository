'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'Sample Article',
      description: 'This is a sample article',
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
