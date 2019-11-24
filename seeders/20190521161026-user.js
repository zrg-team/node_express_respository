'use strict'
const bcryptService = require('../utils/bcrypt')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [{
      user_name: 'admin',
      password: bcryptService.password('admin'),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 2,
      user_type_id: 1
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
