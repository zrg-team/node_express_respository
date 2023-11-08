'use strict';
const bcryptService = require('../utils/bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      user_name: 'sampleuser',
      password: bcryptService.password('samplepassword'),
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
      user_type_id: 2 // Assuming '2' is a valid user_type_id for this example
      // Include additional fields here as necessary
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    // Adjust the condition to match the user(s) you want to remove
    return queryInterface.bulkDelete('users', { user_name: 'sampleuser' }, {});
  }
};
