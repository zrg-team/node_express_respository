'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add default titles for each user type
    const userTypes = [
      { code: 'ADMIN', title: 'Administrator' },
      { code: 'USER', title: 'Standard User' },
      { code: 'CUSTOMER', title: 'Customer' }
    ];
    // Include timestamps for created_at and updated_at
    const timestamp = new Date();
    const userTypesWithTimestamps = userTypes.map(type => ({
      ...type,
      created_at: timestamp,
      updated_at: timestamp
    }));
    // Insert user types into the 'user_types' table
    await queryInterface.bulkInsert('user_types', userTypesWithTimestamps, {});
  },
  down: async (queryInterface, Sequelize) => {
    // Remove the inserted user types from the 'user_types' table
    await queryInterface.bulkDelete('user_types', {
      code: {
        [Sequelize.Op.in]: ['ADMIN', 'USER', 'CUSTOMER']
      }
    }, {});
  }
};
