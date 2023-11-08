'use strict';
const bcryptService = require('../utils/bcrypt');
module.exports = {
  up: (queryInterface, Sequelize) => {
    // Replace 'new_table' with the actual table name you are seeding
    return queryInterface.bulkInsert('new_table', [{
      // Replace these attributes with the ones from your new table
      column1: 'value1',
      column2: 'value2',
      // Use bcryptService for password hashing if your table has a password field
      // password: bcryptService.password('yourPassword'),
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add other columns as needed, following the format above
    }], {});
  },
  down: (queryInterface, Sequelize) => {
    // Replace 'new_table' with the actual table name and adjust the condition as needed
    return queryInterface.bulkDelete('new_table', null, {});
  }
};
