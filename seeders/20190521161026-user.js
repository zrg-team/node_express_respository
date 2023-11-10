'use strict'
const bcryptService = require('../utils/bcrypt')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'admin',
      password: bcryptService.password('admin'),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      avatar: null,
      avatar_file_id: null,
      username: 'admin',
      name: 'Admin User'
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
