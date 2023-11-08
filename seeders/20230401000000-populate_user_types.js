'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('user_types', [
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_types', {
      code: {
        [Sequelize.Op.in]: ['ADMIN', 'USER', 'CUSTOMER']
      }
    }, {});
  }
};
