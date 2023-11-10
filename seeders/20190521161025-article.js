'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'First Article',
      description: 'This is the first article',
      user_id: 1
    }, {
      title: 'Second Article',
      description: 'This is the second article',
      user_id: 2
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', {
      id: {
        [Sequelize.Op.in]: [1, 2]
      }
    }, {})
  }
}
