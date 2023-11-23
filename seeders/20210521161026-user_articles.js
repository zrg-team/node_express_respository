'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_articles', [{
      user_id: 1,
      article_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      read_at: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_articles', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
