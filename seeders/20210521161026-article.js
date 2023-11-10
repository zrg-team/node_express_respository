'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'First Article',
      description: 'This is the first article',
      user_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
