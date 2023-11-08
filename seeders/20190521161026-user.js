'use strict'
const bcryptService = require('../utils/bcrypt')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{ // Corrected table name to 'users'
      user_name: 'admin',
      password: bcryptService.password('admin'), // Assuming bcryptService.password hashes the password
      created_at: new Date(), // Corrected to match the column name in the table
      updated_at: new Date(), // Corrected to match the column name in the table
      status: 2,
      user_type_id: 1
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    // Assuming 'id' is the primary key and auto-incremented, we should not hardcode the id to delete
    return queryInterface.bulkDelete('users', { user_name: 'admin' }, {})
  }
}
