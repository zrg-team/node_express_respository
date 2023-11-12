'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'Sample Article',
      content: 'This is a sample article.',
      publication_date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      user_id: 1,
      category_id: 1
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
