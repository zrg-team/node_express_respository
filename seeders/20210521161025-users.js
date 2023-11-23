'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'admin',
      password: 'admin123',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: null,
      avatar_file_id: null,
      name: 'Admin'
    }, {
      user_name: 'user',
      password: 'user123',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: null,
      avatar_file_id: null,
      name: 'User'
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      user_name: {
        [Sequelize.Op.in]: ['admin', 'user']
      }
    }, {})
  }
}
