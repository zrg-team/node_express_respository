'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    // Insert seed data into 'user_types' table
    return queryInterface.bulkInsert('user_types', [
      {
        code: 'ADMIN',
        title: 'Administrator',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'USER',
        title: 'Standard User',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CUSTOMER',
        title: 'Customer',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    // Remove the inserted data from 'user_types' table
    return queryInterface.bulkDelete('user_types', {
      code: {
        [Sequelize.Op.in]: ['ADMIN', 'USER', 'CUSTOMER']
      }
    }, {});
  }
};
