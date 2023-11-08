'use strict';
const bcryptService = require('../utils/bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add user types to the 'user_types' table
    return queryInterface.bulkInsert('user_types', [
      {
        code: 'ADMIN',
        title: 'Administrator',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'USER',
        title: 'Regular User',
        created_at: new Date(),
        updated_at: new Date()
      }
      // Add more user types here if necessary
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    // Remove the user types from the 'user_types' table
    return queryInterface.bulkDelete('user_types', null, {});
  }
};
