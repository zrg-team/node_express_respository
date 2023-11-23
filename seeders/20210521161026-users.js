'use strict'
const bcryptService = require('../utils/bcrypt')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'admin',
      password: bcryptService.password('admin'),
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: null,
      avatar_file_id: null,
      name: 'Admin'
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', { user_name: { [Sequelize.Op.eq]: 'admin' } }, {})
  }
}
