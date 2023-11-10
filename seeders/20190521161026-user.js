'use strict'
const bcryptService = require('../utils/bcrypt')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'admin',
      password: bcryptService.password('admin'),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 2,
      avatar: null,
      avatar_file_id: null,
      username: 'admin',
      user_type_id: 1,
      name: 'Admin User'
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
