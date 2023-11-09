'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'admin',
      password: 'admin',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: 'default.jpg',
      avatar_file_id: 1
    }, {
      user_name: 'user',
      password: 'user',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: 'default.jpg',
      avatar_file_id: 1
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      id: {
        [Sequelize.Op.in]: [1, 2]
      }
    }, {})
  }
}
